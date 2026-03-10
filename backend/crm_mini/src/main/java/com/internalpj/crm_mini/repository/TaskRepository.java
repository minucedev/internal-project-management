package com.internalpj.crm_mini.repository;

import com.internalpj.crm_mini.entity.Task;
import com.internalpj.crm_mini.entity.enums.TaskStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find tasks for a project with JOIN FETCH to avoid N+1 on assignee and
     * createdBy.
     */
    @Query("""
            SELECT t FROM Task t
            LEFT JOIN FETCH t.assignee
            JOIN FETCH t.createdBy
            WHERE t.project.id = :projectId
            ORDER BY t.createdAt DESC
            """)
    List<Task> findByProjectIdWithUsers(@Param("projectId") Long projectId);

    /**
     * Paginated version — count query avoids the joins for performance.
     */
    @Query(value = """
            SELECT t FROM Task t
            LEFT JOIN FETCH t.assignee
            JOIN FETCH t.createdBy
            WHERE t.project.id = :projectId
            ORDER BY t.createdAt DESC
            """, countQuery = "SELECT COUNT(t) FROM Task t WHERE t.project.id = :projectId")
    Page<Task> findByProjectIdWithUsersPaged(
            @Param("projectId") Long projectId, Pageable pageable);

    /**
     * Fetch a single task ensuring it belongs to the given project.
     * JOIN FETCH eliminates N+1 when mapping to DTO.
     */
    @Query("""
            SELECT t FROM Task t
            LEFT JOIN FETCH t.assignee
            JOIN FETCH t.createdBy
            WHERE t.id = :taskId AND t.project.id = :projectId
            """)
    Optional<Task> findByIdAndProjectId(
            @Param("taskId") Long taskId,
            @Param("projectId") Long projectId);

    /**
     * Count tasks grouped by status for project statistics.
     * Returns pairs of [TaskStatus, Long].
     */
    @Query("""
            SELECT t.status, COUNT(t)
            FROM Task t
            WHERE t.project.id = :projectId
            GROUP BY t.status
            """)
    List<Object[]> countByStatusForProject(@Param("projectId") Long projectId);

    boolean existsByIdAndProjectId(Long id, Long projectId);
}
