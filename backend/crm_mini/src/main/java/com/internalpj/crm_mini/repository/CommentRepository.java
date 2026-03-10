package com.internalpj.crm_mini.repository;

import com.internalpj.crm_mini.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    /**
     * Fetch all comments for a task, JOIN FETCH user to avoid N+1.
     * Sorted oldest → newest (ASC).
     */
    @Query("""
            SELECT c FROM Comment c
            JOIN FETCH c.user
            WHERE c.task.id = :taskId
            ORDER BY c.createdAt ASC
            """)
    List<Comment> findByTaskIdWithUser(@Param("taskId") Long taskId);
}
