package com.internalpj.crm_mini.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.User;

/**
 * Repository interface for Project entity.
 * Provides database operations for projects with soft delete support.
 */
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

        /**
         * Find a project by ID, excluding soft-deleted projects.
         * 
         * @param id the project ID
         * @return Optional containing the project if found and not deleted
         */
        Optional<Project> findByIdAndDeletedAtIsNull(Long id);

        /**
         * Find all projects created by a specific user, excluding soft-deleted
         * projects.
         * 
         * @param createdBy the user who created the projects
         * @param pageable  pagination information
         * @return Page of projects
         */
        Page<Project> findByCreatedByAndDeletedAtIsNull(User createdBy, Pageable pageable);

        /**
         * Find all projects created by a specific user ID, excluding soft-deleted
         * projects.
         * 
         * @param createdById the ID of the user who created the projects
         * @param pageable    pagination information
         * @return Page of projects
         */
        @Query("SELECT p FROM Project p WHERE p.createdBy.id = :createdById AND p.deletedAt IS NULL")
        Page<Project> findByCreatedByIdAndDeletedAtIsNull(@Param("createdById") Long createdById, Pageable pageable);

        /**
         * Find all non-deleted projects.
         * 
         * @param pageable pagination information
         * @return Page of projects
         */
        Page<Project> findByDeletedAtIsNull(Pageable pageable);

        /**
         * Check if a project exists by ID and is not deleted.
         * 
         * @param id the project ID
         * @return true if project exists and is not deleted
         */
        boolean existsByIdAndDeletedAtIsNull(Long id);

        /**
         * Find all projects where a user is a member (via project_users table).
         * This query joins with project_users to get projects the user participates in.
         * 
         * @param userId   the user ID
         * @param pageable pagination information
         * @return Page of projects
         */
        @Query("SELECT DISTINCT p FROM Project p " +
                        "JOIN p.projectUsers pu " +
                        "WHERE pu.id.userId = :userId " +
                        "AND pu.statusInProject = 'ACTIVE' " +
                        "AND p.deletedAt IS NULL")
        Page<Project> findProjectsByUserId(@Param("userId") Long userId, Pageable pageable);

        /**
         * Find all projects where a user has a specific role.
         * 
         * @param userId   the user ID
         * @param role     the role in project (LEADER or MEMBER)
         * @param pageable pagination information
         * @return Page of projects
         */
        @Query("SELECT DISTINCT p FROM Project p " +
                        "JOIN p.projectUsers pu " +
                        "WHERE pu.id.userId = :userId " +
                        "AND pu.roleInProject = :role " +
                        "AND pu.statusInProject = 'ACTIVE' " +
                        "AND p.deletedAt IS NULL")
        Page<Project> findProjectsByUserIdAndRole(
                        @Param("userId") Long userId,
                        @Param("role") String role,
                        Pageable pageable);

        /**
         * Find trashed projects where user is a LEADER.
         * Used for listing projects in trash bin.
         * 
         * @param userId the user ID
         * @return List of deleted projects where user is LEADER
         */
        @Query("SELECT DISTINCT p FROM Project p " +
                        "JOIN p.projectUsers pu " +
                        "WHERE pu.id.userId = :userId " +
                        "AND pu.roleInProject = 'LEADER' " +
                        "AND p.deletedAt IS NOT NULL " +
                        "ORDER BY p.deletedAt DESC")
        java.util.List<Project> findTrashedProjectsByLeaderId(@Param("userId") Long userId);

        /**
         * Find trashed projects where user is a LEADER with member count.
         * Returns projects with member count to avoid N+1 queries.
         * 
         * @param userId the user ID
         * @return List of project summaries with member counts
         */
        @Query("SELECT p.id as projectId, p.name as name, p.description as description, " +
                        "p.startDate as startDate, p.endDate as endDate, " +
                        "p.createdAt as createdAt, p.updatedAt as updatedAt, p.deletedAt as deletedAt, " +
                        "COUNT(pu2) as memberCount " +
                        "FROM Project p " +
                        "JOIN p.projectUsers pu ON pu.id.userId = :userId AND pu.roleInProject = 'LEADER' " +
                        "LEFT JOIN p.projectUsers pu2 ON pu2.statusInProject = 'ACTIVE' " +
                        "WHERE p.deletedAt IS NOT NULL " +
                        "GROUP BY p.id, p.name, p.description, p.startDate, p.endDate, p.createdAt, p.updatedAt, p.deletedAt " +
                        "ORDER BY p.deletedAt DESC")
        java.util.List<TrashedProjectSummary> findTrashedProjectsWithMemberCount(@Param("userId") Long userId);

        /**
         * Projection interface for trashed project summaries with member count.
         */
        interface TrashedProjectSummary {
                Long getProjectId();
                String getName();
                String getDescription();
                java.time.LocalDateTime getStartDate();
                java.time.LocalDateTime getEndDate();
                java.time.LocalDateTime getCreatedAt();
                java.time.LocalDateTime getUpdatedAt();
                java.time.LocalDateTime getDeletedAt();
                Long getMemberCount();
        }

        /**
         * Find projects deleted before a certain date.
         * Used by cleanup scheduler to permanently delete old trashed projects.
         * 
         * @param cutoffDate the cutoff date (e.g., 15 days ago)
         * @return List of projects deleted before the cutoff date
         */
        @Query("SELECT p FROM Project p WHERE p.deletedAt IS NOT NULL " +
                        "AND p.deletedAt < :cutoffDate")
        java.util.List<Project> findProjectsDeletedBefore(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);

        /**
         * Find project by ID including deleted ones.
         * Used for restore operation.
         * 
         * @param id the project ID
         * @return Optional containing the project (even if deleted)
         */
        @Query("SELECT p FROM Project p WHERE p.id = :id")
        Optional<Project> findByIdIncludingDeleted(@Param("id") Long id);
}
