package com.internalpj.crm_mini.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.ProjectUserId;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;

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
         * Find all active members of a project with USER JOIN FETCH.
         * Prevents N+1 queries when accessing user details.
         * 
         * @param projectId the project ID
         * @return List of active ProjectUser entities with users fetched
         */
        @Query("SELECT pu FROM ProjectUser pu " +
                        "LEFT JOIN FETCH pu.user u " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject = 'ACTIVE' " +
                        "ORDER BY CASE WHEN pu.roleInProject = 'LEADER' THEN 0 ELSE 1 END, pu.joinedAt ASC")
        List<ProjectUser> findActiveMembersWithUsers(@Param("projectId") Long projectId);

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
         * Find all projects where a user is a member with pagination and JOIN FETCH.
         * Supports dynamic sorting and avoids N+1 queries by fetching project data.
         * 
         * @param userId the user ID
         * @param status the membership status
         * @param pageable pagination and sorting information
         * @return Page of ProjectUser entities with projects JOIN FETCHED
         */
        @Query(value = "SELECT pu FROM ProjectUser pu " +
                        "LEFT JOIN FETCH pu.project p " +
                        "WHERE pu.id.userId = :userId " +
                        "AND pu.statusInProject = :status",
               countQuery = "SELECT COUNT(pu) FROM ProjectUser pu " +
                        "WHERE pu.id.userId = :userId " +
                        "AND pu.statusInProject = :status")
        Page<ProjectUser> findByIdUserIdAndStatusInProjectWithPagination(
                        @Param("userId") Long userId,
                        @Param("status") ProjectUserStatus status,
                        Pageable pageable);

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
         * Batch count active members for multiple projects.
         * Returns a map of projectId -> memberCount to avoid N+1 queries.
         * 
         * @param projectIds list of project IDs
         * @return map of project ID to member count
         */
        @Query("SELECT pu.id.projectId as projectId, COUNT(pu) as memberCount " +
                        "FROM ProjectUser pu " +
                        "WHERE pu.id.projectId IN :projectIds " +
                        "AND pu.statusInProject = 'ACTIVE' " +
                        "GROUP BY pu.id.projectId")
        List<ProjectMemberCount> batchCountActiveMembersByProjectIds(@Param("projectIds") List<Long> projectIds);

        /**
         * Projection interface for batch member counting results.
         */
        interface ProjectMemberCount {
                Long getProjectId();
                Long getMemberCount();
        }

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

        // ========== REUSABLE MEMBER QUERIES ==========

        /**
         * REUSABLE: Find members by project and multiple statuses with JOIN FETCH.
         * Can be used by both MemberService and ProjectService.
         * Prevents N+1 queries by fetching user data.
         * 
         * @param projectId the project ID
         * @param statuses the list of statuses to include
         * @return List of ProjectUser entities with users fetched
         */
        @Query("SELECT pu FROM ProjectUser pu " +
                        "LEFT JOIN FETCH pu.user u " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN :statuses " +
                        "ORDER BY CASE WHEN pu.roleInProject = 'LEADER' THEN 0 ELSE 1 END, " +
                        "CASE WHEN pu.statusInProject = 'ACTIVE' THEN 0 ELSE 1 END, " +
                        "pu.joinedAt ASC")
        List<ProjectUser> findMembersWithUsersByProjectIdAndStatuses(
                        @Param("projectId") Long projectId,
                        @Param("statuses") List<ProjectUserStatus> statuses);

        /**
         * REUSABLE: Find members with pagination and JOIN FETCH.
         * Supports flexible status filtering and dynamic sorting.
         * 
         * @param projectId the project ID
         * @param statuses the list of statuses to include  
         * @param pageable pagination and sorting information
         * @return Page of ProjectUser entities with users fetched
         */
        @Query(value = "SELECT pu FROM ProjectUser pu " +
                        "LEFT JOIN FETCH pu.user u " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN :statuses",
               countQuery = "SELECT COUNT(pu) FROM ProjectUser pu " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN :statuses")
        Page<ProjectUser> findMembersWithUsersByProjectIdAndStatusesWithPagination(
                        @Param("projectId") Long projectId,
                        @Param("statuses") List<ProjectUserStatus> statuses,
                        Pageable pageable);

        /**
         * REUSABLE: Get comprehensive member statistics in a single query.
         * Returns all statistics needed by both services.
         * 
         * @param projectId the project ID
         * @return Member statistics projection
         */
        @Query("SELECT " +
                        "COUNT(*) as totalMembers, " +
                        "SUM(CASE WHEN pu.statusInProject = 'ACTIVE' THEN 1 ELSE 0 END) as activeCount, " +
                        "SUM(CASE WHEN pu.statusInProject = 'PENDING' THEN 1 ELSE 0 END) as pendingCount, " +
                        "SUM(CASE WHEN pu.statusInProject = 'INACTIVE' THEN 1 ELSE 0 END) as inactiveCount, " +
                        "SUM(CASE WHEN pu.roleInProject = 'LEADER' AND pu.statusInProject = 'ACTIVE' THEN 1 ELSE 0 END) as activeLeaderCount, " +
                        "SUM(CASE WHEN pu.roleInProject = 'MEMBER' AND pu.statusInProject = 'ACTIVE' THEN 1 ELSE 0 END) as activeMemberCount, " +
                        "SUM(CASE WHEN pu.roleInProject = 'VIEWER' AND pu.statusInProject = 'ACTIVE' THEN 1 ELSE 0 END) as activeViewerCount " +
                        "FROM ProjectUser pu WHERE pu.id.projectId = :projectId")
        MemberStatistics getMemberStatistics(@Param("projectId") Long projectId);

        /**
         * REUSABLE: Projection interface for member statistics.
         * Contains all statistics needed by services.
         */
        interface MemberStatistics {
                Long getTotalMembers();
                Long getActiveCount();
                Long getPendingCount();
                Long getInactiveCount();
                Long getActiveLeaderCount();
                Long getActiveMemberCount();
                Long getActiveViewerCount();
        }

        /**
         * REUSABLE: Search members by username/email with flexible filters.
         * Can be used for member search functionality.
         * 
         * @param projectId the project ID
         * @param searchTerm the search term (username or email)
         * @param statuses the list of statuses to include
         * @param roleFilter optional role filter
         * @param pageable pagination and sorting
         * @return Page of matching ProjectUser entities
         */
        @Query(value = "SELECT pu FROM ProjectUser pu " +
                        "LEFT JOIN FETCH pu.user u " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN :statuses " +
                        "AND (:roleFilter IS NULL OR pu.roleInProject = :roleFilter) " +
                        "AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "     LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))",
               countQuery = "SELECT COUNT(pu) FROM ProjectUser pu " +
                        "JOIN pu.user u " +
                        "WHERE pu.id.projectId = :projectId " +
                        "AND pu.statusInProject IN :statuses " +
                        "AND (:roleFilter IS NULL OR pu.roleInProject = :roleFilter) " +
                        "AND (LOWER(u.username) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
                        "     LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
        Page<ProjectUser> searchMembersWithUsers(
                        @Param("projectId") Long projectId,
                        @Param("searchTerm") String searchTerm,
                        @Param("statuses") List<ProjectUserStatus> statuses,
                        @Param("roleFilter") ProjectRole roleFilter,
                        Pageable pageable);

        // ========== CONVENIENCE METHODS USING REUSABLE QUERIES ==========

        /**
         * CONVENIENCE: Get active + pending members (wraps reusable method).
         */
        default List<ProjectUser> findActivePendingMembersWithUsers(Long projectId) {
                return findMembersWithUsersByProjectIdAndStatuses(projectId,
                        List.of(ProjectUserStatus.ACTIVE, ProjectUserStatus.PENDING));
        }
}
