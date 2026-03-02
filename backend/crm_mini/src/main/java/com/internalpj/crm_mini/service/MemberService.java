package com.internalpj.crm_mini.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.internalpj.crm_mini.dto.request.InviteMemberRequest;
import com.internalpj.crm_mini.dto.response.InviteResponse;
import com.internalpj.crm_mini.dto.response.MemberDetailResponse;
import com.internalpj.crm_mini.dto.response.MemberListResponse;
import com.internalpj.crm_mini.dto.response.MemberResponse;
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
                .orElseThrow(() -> NotFoundException.project(projectId));

        // Find user by email
        User userToInvite = userRepository.findByEmailAndDeletedAtIsNull(request.getEmail())
                .orElseThrow(() -> NotFoundException.user());

        // Check if already a member
        ProjectUserId id = new ProjectUserId(projectId, userToInvite.getId());
        ProjectUser existing = projectUserRepository.findById(id).orElse(null);

        if (existing != null && existing.isActive()) {
            throw ConflictException.memberAlreadyExists();
        }

        if (existing != null && existing.getStatusInProject() == ProjectUserStatus.PENDING) {
            throw ConflictException.pendingInvitationExists();
        }

        // Generate invite token
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime expiry = LocalDateTime.now().plusDays(7);

        if (existing != null) {
            // Reuse existing record (was INACTIVE)
            existing.setStatusInProject(ProjectUserStatus.PENDING);
            existing.setInviteToken(token);
            existing.setInviteExpiry(expiry);
            existing.setRoleInProject(request.getRole() != null ? request.getRole() : ProjectRole.MEMBER);
            existing.setPositionTitle(request.getPositionTitle());
            projectUserRepository.save(existing);
        } else {
            // Create new invitation
            ProjectUser invitation = ProjectUser.builder()
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
                .orElseThrow(() -> NotFoundException.invitation());

        // Validate invitation
        if (!invitation.getUser().getId().equals(currentUserId)) {
            throw ForbiddenException.invitationForbidden();
        }

        if (invitation.isInviteExpired()) {
            throw BadRequestException.invitationExpired();
        }

        if (invitation.getStatusInProject() != ProjectUserStatus.PENDING) {
            throw BadRequestException.invitationNotPending();
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
     * Get all members of a project with pagination and enhanced filtering.
     * Regular members see only ACTIVE.
     * LEADERs can optionally see PENDING invitations.
     * Uses reusable repository queries for optimal performance.
     * 
     * @param projectId      the project ID
     * @param includePending whether to include pending invitations
     * @param page           page number (0-indexed)
     * @param size           page size
     * @param sortBy         sort field (username, email, role, joinedAt)
     * @return paginated member list with statistics
     */
    public MemberListResponse getMembers(Long projectId, boolean includePending,
            int page, int size, String sortBy) {
        log.info("Getting members for project {} (includePending: {}, page: {}, size: {})",
                projectId, includePending, page, size);

        Long currentUserId = securityService.getCurrentUserId();
        securityService.requireMember(projectId, currentUserId);

        ProjectRole currentUserRole = securityService.getUserRoleInProject(projectId, currentUserId);

        // Determine which statuses to include based on user role and request
        List<ProjectUserStatus> statuses = determineStatusesToInclude(includePending, currentUserRole);

        // For small projects, use simple list; for larger projects, use pagination
        if (page == 0 && size >= 100) {
            return getMembersWithoutPagination(projectId, statuses);
        } else {
            return getMembersWithPagination(projectId, statuses, page, size, sortBy);
        }
    }

    /**
     * Get members without pagination (for small projects).
     */
    private MemberListResponse getMembersWithoutPagination(Long projectId,
            List<ProjectUserStatus> statuses) {
        // Use reusable query with JOIN FETCH
        List<ProjectUser> members = projectUserRepository
                .findMembersWithUsersByProjectIdAndStatuses(projectId, statuses);

        // Get statistics in single query
        ProjectUserRepository.MemberStatistics stats = projectUserRepository.getMemberStatistics(projectId);

        // Convert to responses
        List<MemberResponse> memberResponses = memberMapper.toResponseList(members);

        return buildMemberListResponse(memberResponses, stats, null);
    }

    /**
     * Get members with pagination (for larger projects).
     */
    private MemberListResponse getMembersWithPagination(Long projectId,
            List<ProjectUserStatus> statuses,
            int page, int size, String sortBy) {
        // Create pageable with dynamic sorting
        Pageable pageable = createMemberSort(page, size, sortBy);

        // Use reusable paginated query with JOIN FETCH
        Page<ProjectUser> membersPage = projectUserRepository
                .findMembersWithUsersByProjectIdAndStatusesWithPagination(
                        projectId, statuses, pageable);

        // Get statistics in single query
        ProjectUserRepository.MemberStatistics stats = projectUserRepository.getMemberStatistics(projectId);

        // Convert to responses
        List<MemberResponse> memberResponses = memberMapper.toResponseList(membersPage.getContent());

        return buildMemberListResponse(memberResponses, stats, membersPage);
    }

    /**
     * Determine which statuses to include based on user permissions.
     */
    private List<ProjectUserStatus> determineStatusesToInclude(boolean includePending,
            ProjectRole currentUserRole) {
        if (includePending && currentUserRole == ProjectRole.LEADER) {
            return List.of(ProjectUserStatus.ACTIVE, ProjectUserStatus.PENDING);
        } else {
            return List.of(ProjectUserStatus.ACTIVE);
        }
    }

    /**
     * Create Pageable with member-specific sorting options.
     */
    private Pageable createMemberSort(int page, int size, String sortBy) {
        Sort sort = Sort.by(Sort.Direction.ASC, "joinedAt"); // Default sort

        if (sortBy != null && !sortBy.trim().isEmpty()) {
            String sortField = sortBy.toLowerCase().trim();
            Sort.Direction direction = Sort.Direction.ASC;

            // Handle descending sorts
            if (sortField.endsWith(" desc")) {
                direction = Sort.Direction.DESC;
                sortField = sortField.substring(0, sortField.length() - 5).trim();
            }

            // Map sort fields
            switch (sortField) {
                case "username":
                    sort = Sort.by(direction, "user.username");
                    break;
                case "email":
                    sort = Sort.by(direction, "user.email");
                    break;
                case "role":
                    sort = Sort.by(direction, "roleInProject");
                    break;
                case "status":
                    sort = Sort.by(direction, "statusInProject");
                    break;
                case "joined":
                case "joinedat":
                default:
                    sort = Sort.by(direction, "joinedAt");
                    break;
            }
        }

        return PageRequest.of(page, size, sort);
    }

    /**
     * Build member list response with statistics and optional pagination metadata.
     */
    private MemberListResponse buildMemberListResponse(List<MemberResponse> memberResponses,
            ProjectUserRepository.MemberStatistics stats,
            Page<ProjectUser> membersPage) {
        MemberListResponse.MemberListResponseBuilder builder = MemberListResponse.builder()
                .members(memberResponses)
                .totalMembers(stats.getTotalMembers())
                .activeCount(stats.getActiveCount())
                .pendingCount(stats.getPendingCount())
                .leaderCount(stats.getActiveLeaderCount())
                .memberCount(stats.getActiveMemberCount())
                .viewerCount(stats.getActiveViewerCount());

        // Add pagination metadata if present
        if (membersPage != null) {
            builder.currentPage(membersPage.getNumber())
                    .pageSize(membersPage.getSize())
                    .totalPages(membersPage.getTotalPages())
                    .hasNext(membersPage.hasNext())
                    .hasPrevious(membersPage.hasPrevious());
        }

        return builder.build();
    }

    /**
     * Search members by username or email (NEW FEATURE using reusable queries).
     * Only accessible by project LEADERs and MEMBERs.
     */
    public MemberListResponse searchMembers(Long projectId, String searchTerm,
            ProjectRole roleFilter, boolean includePending,
            int page, int size) {
        log.info("Searching members in project {} with term: {}", projectId, searchTerm);

        Long currentUserId = securityService.getCurrentUserId();
        securityService.requireMember(projectId, currentUserId);

        ProjectRole currentUserRole = securityService.getUserRoleInProject(projectId, currentUserId);

        // Determine statuses based on permissions
        List<ProjectUserStatus> statuses = determineStatusesToInclude(includePending, currentUserRole);

        // Create pageable
        Pageable pageable = PageRequest.of(page, size, Sort.by("joinedAt"));

        // Use reusable search query
        Page<ProjectUser> searchResults = projectUserRepository.searchMembersWithUsers(
                projectId, searchTerm, statuses, roleFilter, pageable);

        // Get statistics
        ProjectUserRepository.MemberStatistics stats = projectUserRepository.getMemberStatistics(projectId);

        // Convert to responses
        List<MemberResponse> memberResponses = memberMapper.toResponseList(searchResults.getContent());

        return buildMemberListResponse(memberResponses, stats, searchResults);
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
                .orElseThrow(() -> NotFoundException.member());

        // Check if removing a LEADER
        if (member.getRoleInProject() == ProjectRole.LEADER) {
            long leaderCount = projectUserRepository.countActiveLeaders(projectId);
            if (leaderCount <= 1) {
                throw BadRequestException.cannotRemoveLastLeader();
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
