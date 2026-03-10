package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.dto.request.CommentCreateRequest;
import com.internalpj.crm_mini.dto.response.CommentListResponse;
import com.internalpj.crm_mini.dto.response.CommentResponse;
import com.internalpj.crm_mini.entity.Comment;
import com.internalpj.crm_mini.entity.Task;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.mapper.CommentMapper;
import com.internalpj.crm_mini.repository.CommentRepository;
import com.internalpj.crm_mini.repository.TaskRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    // ── GET comments ─────────────────────────────────────────────────────────

    /**
     * All active project members (LEADER, MEMBER, VIEWER) may list comments.
     * ProjectRoleInterceptor has already verified project membership.
     */
    @Transactional(readOnly = true)
    public CommentListResponse getComments(Long projectId, Long taskId) {
        verifyTaskInProject(taskId, projectId);

        List<CommentResponse> responses = commentRepository
                .findByTaskIdWithUser(taskId)
                .stream()
                .map(commentMapper::toResponse)
                .toList();

        return CommentListResponse.builder()
                .comments(responses)
                .taskId(taskId)
                .total(responses.size())
                .build();
    }

    // ── POST comment ─────────────────────────────────────────────────────────

    /**
     * LEADER and MEMBER may create comments. VIEWER → 403.
     * ProjectRoleInterceptor has already verified project membership.
     */
    @Transactional
    public CommentResponse createComment(Long projectId,
            Long taskId,
            CommentCreateRequest request,
            Long userId,
            ProjectRole callerRole) {
        if (callerRole == ProjectRole.VIEWER) {
            throw ForbiddenException.memberOnly();
        }

        Task task = verifyTaskInProject(taskId, projectId);

        User user = userRepository.findById(userId)
                .orElseThrow(NotFoundException::user);

        Comment comment = Comment.builder()
                .content(request.getContent())
                .task(task)
                .user(user)
                .build();

        return commentMapper.toResponse(commentRepository.save(comment));
    }

    // ── helper ───────────────────────────────────────────────────────────────

    private Task verifyTaskInProject(Long taskId, Long projectId) {
        return taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> NotFoundException.task(taskId));
    }
}
