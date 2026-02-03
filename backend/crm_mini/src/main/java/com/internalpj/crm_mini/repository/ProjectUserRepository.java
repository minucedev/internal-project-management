package com.internalpj.crm_mini.repository;

import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.ProjectUserId;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface for ProjectUser entity.
 * Handles the many-to-many relationship between Projects and Users.
 */
@Repository
public interface ProjectUserRepository extends JpaRepository<ProjectUser, ProjectUserId> {

        /**
         * Find a project-user relationship by composite ID.
         * 
         * @param projectId the project ID
         * @param userId    the user ID
         * @return Optional containing the ProjectUser if found
         */
        @Query("SELECT pu FROM ProjectUser pu WHERE pu.id.projectId = :projectId AND pu.id.userId = :userId")
        Optional<ProjectUser> findByIdProjectIdAndIdUserId(
                        @Param("projectId") Long projectId,
                        @Param("userId") Long userId);

        /**
         * Find all project members by project ID and status.
         * 
         * @param projectId the project ID
         * @param status    the membership status
         * @return List of ProjectUser entities
         */
        @Query("SELECT pu FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject = :status " +
                        "ORDER BY CASE WHEN pu.roleInProject = 'LEADER' THEN 0 ELSE 1 END, pu.joinedAt ASC")
        List<ProjectUser> findByIdProjectIdAndStatusInProject(
                        @Param("projectId") Long projectId,
                        @Param("status") ProjectUserStatus status);

        /**
         * Find all active members of a project.
         * 
         * @param projectId the project ID
         * @return List of active ProjectUser entities
         */
        default List<ProjectUser> findActiveMembers(Long projectId) {
                return findByIdProjectIdAndStatusInProject(projectId, ProjectUserStatus.ACTIVE);
        }

        /**
         * Count members by project ID and role.
         * 
         * @param projectId the project ID
         * @param role      the role in project
         * @return count of members with the specified role
         */
        @Query("SELECT COUNT(pu) FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.roleInProject = :role " +
                        "AND pu.statusInProject = 'ACTIVE'")
        long countByIdProjectIdAndRoleInProject(
                        @Param("projectId") Long projectId,
                        @Param("role") ProjectRole role);

        /**
         * Count active leaders in a project.
         * 
         * @param projectId the project ID
         * @return count of active leaders
         */
        default long countActiveLeaders(Long projectId) {
                return countByIdProjectIdAndRoleInProject(projectId, ProjectRole.LEADER);
        }

        /**
         * Check if a user is a member of a project with a specific status.
         * 
         * @param projectId the project ID
         * @param userId    the user ID
         * @param status    the membership status
         * @return true if the user is a member with the specified status
         */
        @Query("SELECT CASE WHEN COUNT(pu) > 0 THEN true ELSE false END " +
                        "FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.id.userId = :userId " +
                        "AND pu.statusInProject = :status")
        boolean existsByIdProjectIdAndIdUserIdAndStatusInProject(
                        @Param("projectId") Long projectId,
                        @Param("userId") Long userId,
                        @Param("status") ProjectUserStatus status);

        /**
         * Check if a user is an active member of a project.
         * 
         * @param projectId the project ID
         * @param userId    the user ID
         * @return true if the user is an active member
         */
        default boolean isActiveMember(Long projectId, Long userId) {
                return existsByIdProjectIdAndIdUserIdAndStatusInProject(projectId, userId, ProjectUserStatus.ACTIVE);
        }

        /**
         * Find all projects where a user is a member.
         * 
         * @param userId the user ID
         * @param status the membership status
         * @return List of ProjectUser entities
         */
        @Query("SELECT pu FROM ProjectUser pu WHERE pu.id.userId = :userId AND pu.statusInProject = :status")
        List<ProjectUser> findByIdUserIdAndStatusInProject(
                        @Param("userId") Long userId,
                        @Param("status") ProjectUserStatus status);

        /**
         * Get the role of a user in a project.
         * 
         * @param projectId the project ID
         * @param userId    the user ID
         * @return Optional containing the ProjectRole if found
         */
        @Query("SELECT pu.roleInProject FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.id.userId = :userId " +
                        "AND pu.statusInProject = 'ACTIVE'")
        Optional<ProjectRole> findRoleByProjectIdAndUserId(
                        @Param("projectId") Long projectId,
                        @Param("userId") Long userId);

        /**
         * Get the role of a user in a project, regardless of status.
         * Used for authorization checks on deleted projects (e.g., hard delete).
         * 
         * @param projectId the project ID
         * @param userId    the user ID
         * @return Optional containing the ProjectRole if found
         */
        @Query("SELECT pu.roleInProject FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.id.userId = :userId")
        Optional<ProjectRole> findRoleByProjectIdAndUserIdIgnoreStatus(
                        @Param("projectId") Long projectId,
                        @Param("userId") Long userId);

        /**
         * Count total active members in a project.
         * 
         * @param projectId the project ID
         * @return count of active members
         */
        @Query("SELECT COUNT(pu) FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject = 'ACTIVE'")
        long countActiveMembersByProjectId(@Param("projectId") Long projectId);

        /**
         * Find invitation by token.
         * Used for accepting invitations.
         * 
         * @param token the invitation token
         * @return Optional containing the ProjectUser if found
         */
        @Query("SELECT pu FROM ProjectUser pu WHERE pu.inviteToken = :token")
        Optional<ProjectUser> findByInviteToken(@Param("token") String token);

        /**
         * Find members including PENDING invitations.
         * Used by LEADERs to see pending invites.
         * 
         * @param projectId the project ID
         * @return List of ProjectUser entities (ACTIVE and PENDING)
         */
        @Query("SELECT pu FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN ('ACTIVE', 'PENDING') " +
                        "ORDER BY CASE WHEN pu.roleInProject = 'LEADER' THEN 0 ELSE 1 END, " +
                        "CASE WHEN pu.statusInProject = 'ACTIVE' THEN 0 ELSE 1 END, " +
                        "pu.joinedAt ASC")
        List<ProjectUser> findByProjectIdIncludingPending(@Param("projectId") Long projectId);
}
