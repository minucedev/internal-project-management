package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.ProjectUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

/**
 * Service for handling project-related security checks.
 * Provides helper methods for authorization and access control.
 */
@Service
@RequiredArgsConstructor
public class ProjectSecurityService {

    private final ProjectUserRepository projectUserRepository;
    private final ProjectRepository projectRepository;

    /**
     * Get the current authenticated user's ID from SecurityContext.
     * 
     * @return the current user's ID
     * @throws ForbiddenException if user is not authenticated
     */
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw ForbiddenException.notAuthenticated();
        }

        Object principal = authentication.getPrincipal();

        // Check if principal is a User entity (from JwtAuthenticationFilter)
        if (principal instanceof User) {
            Long userId = ((User) principal).getId();
            System.out.println("DEBUG: Extracted user ID: " + userId);
            return userId;
        }

        // Fallback: try to parse as Long
        if (principal instanceof Long) {
            return (Long) principal;
        }

        // Last resort: try to parse string representation
        try {
            return Long.parseLong(principal.toString());
        } catch (NumberFormatException e) {
            throw ForbiddenException.invalidUserAuthentication();
        }
    }

    /**
     * Check if a user is a member of a project (with ACTIVE status).
     * Throws ForbiddenException if user is not a member.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     * @throws ForbiddenException if user is not an active member
     */
    public void checkUserInProject(Long projectId, Long userId) {
        boolean isMember = projectUserRepository.isActiveMember(projectId, userId);

        if (!isMember) {
            throw ForbiddenException.memberOnly();
        }
    }

    /**
     * Check if a user is a LEADER of a project.
     * Throws ForbiddenException if user is not a leader.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     * @throws ForbiddenException if user is not a leader
     */
    public void checkUserIsLeader(Long projectId, Long userId) {
        ProjectRole role = projectUserRepository.findRoleByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> ForbiddenException.memberOnly());

        if (role != ProjectRole.LEADER) {
            throw ForbiddenException.leaderOnly();
        }
    }

    /**
     * Get the role of a user in a project.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     * @return the user's role in the project
     * @throws NotFoundException if user is not in the project
     */
    public ProjectRole getUserRoleInProject(Long projectId, Long userId) {
        return projectUserRepository.findRoleByProjectIdAndUserId(projectId, userId)
                .orElseThrow(() -> NotFoundException.member());
    }

    /**
     * Check if a project exists and is not deleted.
     * 
     * @param projectId the project ID
     * @throws NotFoundException if project doesn't exist or is deleted
     */
    public void checkProjectExists(Long projectId) {
        boolean exists = projectRepository.existsByIdAndDeletedAtIsNull(projectId);

        if (!exists) {
            throw NotFoundException.project(projectId);
        }
    }

    /**
     * Check if user has write permission (LEADER or MEMBER, not VIEWER).
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     * @return true if user has write permission
     */
    public boolean hasWritePermission(Long projectId, Long userId) {
        ProjectRole role = getUserRoleInProject(projectId, userId);
        return role == ProjectRole.LEADER || role == ProjectRole.MEMBER;
    }

    /**
     * Check if user is a LEADER or throw exception.
     * Convenience method that combines existence and leader check.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     */
    public void requireLeader(Long projectId, Long userId) {
        checkProjectExists(projectId);
        checkUserIsLeader(projectId, userId);
    }

    /**
     * Check if user is a MEMBER (any role) or throw exception.
     * Convenience method that combines existence and member check.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     */
    public void requireMember(Long projectId, Long userId) {
        checkProjectExists(projectId);
        checkUserInProject(projectId, userId);
    }

    /**
     * Check if a user is a LEADER of a project, ignoring status.
     * Used for operations on soft-deleted projects (e.g., hard delete).
     * Throws ForbiddenException if user is not a leader.
     * 
     * @param projectId the project ID
     * @param userId    the user ID
     * @throws ForbiddenException if user is not a leader
     */
    public void checkUserIsLeaderIgnoreStatus(Long projectId, Long userId) {
        ProjectRole role = projectUserRepository.findRoleByProjectIdAndUserIdIgnoreStatus(projectId, userId)
                .orElseThrow(() -> ForbiddenException.memberOnly());

        if (role != ProjectRole.LEADER) {
            throw ForbiddenException.leaderOnly();
        }
    }
}
