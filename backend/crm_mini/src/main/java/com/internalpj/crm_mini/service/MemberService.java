package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.dto.request.InviteMemberRequest;
import com.internalpj.crm_mini.dto.response.InviteResponse;
import com.internalpj.crm_mini.dto.response.MemberDetailResponse;
import com.internalpj.crm_mini.dto.response.MemberListResponse;
import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.ProjectUserId;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import com.internalpj.crm_mini.exception.BadRequestException;
import com.internalpj.crm_mini.exception.ConflictException;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.mapper.MemberMapper;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.ProjectUserRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Service for managing project members with invitation-based system.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProjectSecurityService securityService;
    private final MemberMapper memberMapper;
    private final EmailService emailService;

    /**
     * Invite a user to join the project.
     * Creates PENDING invitation with token and sends email.
     * Only LEADER can invite.
     */
    @Transactional
    public InviteResponse inviteMember(Long projectId, InviteMemberRequest request) {
        log.info("Inviting member {} to project {}", request.getEmail(), projectId);

        // Authorization check
        Long currentUserId = securityService.getCurrentUserId();
        securityService.requireLeader(projectId, currentUserId);

        // Verify project exists
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> new NotFoundException("Project", projectId));

        // Find user by email
        User userToInvite = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> new NotFoundException("User not found: " + request.getEmail()));

        // Check if already a member
        ProjectUserId id = new ProjectUserId(projectId, userToInvite.getId());
        ProjectUser existing = projectUserRepository.findById(id).orElse(null);

        if (existing != null && existing.isActive()) {
            throw new ConflictException("User is already an active member");
        }

        if (existing != null && existing.getStatusInProject() == ProjectUserStatus.PENDING) {
            throw new ConflictException("User already has a pending invitation");
        }

        // Generate invite token
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiry = LocalDateTime.now().plusDays(7);

        ProjectUser invitation;
        if (existing != null) {
            // Reuse existing record (was INACTIVE)
            existing.setStatusInProject(ProjectUserStatus.PENDING);
            existing.setInviteToken(token);
            existing.setInviteExpiry(expiry);
            existing.setRoleInProject(request.getRole() != null ? request.getRole() : ProjectRole.MEMBER);
            existing.setPositionTitle(request.getPositionTitle());
            invitation = projectUserRepository.save(existing);
        } else {
            // Create new invitation
            invitation = ProjectUser.builder()
                    .id(id)
                    .project(project)
                    .user(userToInvite)
                    .roleInProject(request.getRole() != null ? request.getRole() : ProjectRole.MEMBER)
                    .statusInProject(ProjectUserStatus.PENDING)
                    .positionTitle(request.getPositionTitle())
                    .inviteToken(token)
                    .inviteExpiry(expiry)
                    .build();
            projectUserRepository.save(invitation);
        }

        // Send email
        emailService.sendInviteEmail(userToInvite.getEmail(), project.getName(), token);

        log.info("Created invitation for {} to project {}", request.getEmail(), projectId);

        return InviteResponse.builder()
                .userId(userToInvite.getId())
                .email(userToInvite.getEmail())
                .inviteToken(token)
                .expiresAt(expiry)
                .message("Invitation email sent to " + request.getEmail())
                .build();
    }

    /**
     * Accept invitation and join project.
     * User must be authenticated and token must be valid.
     */
    @Transactional
    public MemberDetailResponse acceptInvitation(String token) {
        log.info("Accepting invitation with token: {}", token);

        Long currentUserId = securityService.getCurrentUserId();

        // Find invitation by token
        ProjectUser invitation = projectUserRepository.findByInviteToken(token)
                .orElseThrow(() -> new NotFoundException("Invalid or expired invitation"));

        // Validate invitation
        if (!invitation.getUser().getId().equals(currentUserId)) {
            throw new ForbiddenException("This invitation is for a different user");
        }

        if (invitation.isInviteExpired()) {
            throw new BadRequestException("Invitation has expired");
        }

        if (invitation.getStatusInProject() != ProjectUserStatus.PENDING) {
            throw new BadRequestException("Invitation is not pending");
        }

        // Accept invitation
        invitation.acceptInvitation(); // Sets status to ACTIVE, joinedAt to now
        invitation.setInviteToken(null);
        invitation.setInviteExpiry(null);

        ProjectUser member = projectUserRepository.save(invitation);

        log.info("User {} accepted invitation to project {}",
                currentUserId, invitation.getProject().getId());

        return memberMapper.toDetailResponse(member);
    }

    /**
     * Get all members of a project.
     * Regular members see only ACTIVE.
     * LEADERs can optionally see PENDING invitations.
     */
    public MemberListResponse getMembers(Long projectId, boolean includePending) {
        log.info("Getting members for project {} (includePending: {})", projectId, includePending);

        Long currentUserId = securityService.getCurrentUserId();
        securityService.requireMember(projectId, currentUserId);

        ProjectRole currentUserRole = securityService.getUserRoleInProject(projectId, currentUserId);

        List<ProjectUser> members;
        if (includePending && currentUserRole == ProjectRole.LEADER) {
            // LEADER can see PENDING invites
            members = projectUserRepository.findByProjectIdIncludingPending(projectId);
        } else {
            // Regular members see only ACTIVE
            members = projectUserRepository.findActiveMembers(projectId);
        }

        return memberMapper.toListResponse(members);
    }

    /**
     * Remove a member from project.
     * Only LEADER can remove.
     * Cannot remove the last LEADER.
     */
    @Transactional
    public void removeMember(Long projectId, Long userIdToRemove) {
        log.info("Removing user {} from project {}", userIdToRemove, projectId);

        Long currentUserId = securityService.getCurrentUserId();
        securityService.requireLeader(projectId, currentUserId);

        // Find member
        ProjectUserId id = new ProjectUserId(projectId, userIdToRemove);
        ProjectUser member = projectUserRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Member not found"));

        // Check if removing a LEADER
        if (member.getRoleInProject() == ProjectRole.LEADER) {
            long leaderCount = projectUserRepository.countActiveLeaders(projectId);
            if (leaderCount <= 1) {
                throw new BadRequestException("Cannot remove the last leader");
            }
        }

        // Soft remove (set to INACTIVE)
        member.deactivate();
        member.setInviteToken(null); // Clear any pending invite
        member.setInviteExpiry(null);
        projectUserRepository.save(member);

        log.info("Successfully removed user {} from project {}", userIdToRemove, projectId);
    }
}
