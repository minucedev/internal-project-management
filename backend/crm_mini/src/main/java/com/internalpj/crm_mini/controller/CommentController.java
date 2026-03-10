package com.internalpj.crm_mini.controller;

import com.internalpj.crm_mini.common.ApiResponse;
import com.internalpj.crm_mini.dto.request.CommentCreateRequest;
import com.internalpj.crm_mini.dto.response.CommentListResponse;
import com.internalpj.crm_mini.dto.response.CommentResponse;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.interceptor.ProjectRoleInterceptor;
import com.internalpj.crm_mini.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for comments on a task.
 *
 * <p>
 * The {@link ProjectRoleInterceptor} runs for all /api/projects/*&#47;tasks/**
 * paths and injects {@code projectRole} + {@code currentUserId} as request
 * attributes.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/tasks/{taskId}/comments")
@Tag(name = "Comment Management", description = "APIs for managing comments on tasks")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // ── helpers ──────────────────────────────────────────────────────────────

    private ProjectRole role(HttpServletRequest req) {
        return (ProjectRole) req.getAttribute(ProjectRoleInterceptor.ATTR_PROJECT_ROLE);
    }

    private Long userId(HttpServletRequest req) {
        return (Long) req.getAttribute(ProjectRoleInterceptor.ATTR_CURRENT_USER_ID);
    }

    // ── GET /api/projects/{projectId}/tasks/{taskId}/comments ────────────────

    @GetMapping
    @Operation(summary = "List comments on a task", description = "Returns all comments for a task, sorted oldest → newest. "
            + "Accessible by LEADER, MEMBER, and VIEWER.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Comments retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a project member"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<CommentListResponse>> getComments(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(ApiResponse.success(
                commentService.getComments(projectId, taskId)));
    }

    // ── POST /api/projects/{projectId}/tasks/{taskId}/comments ───────────────

    @PostMapping
    @Operation(summary = "Add a comment to a task", description = "Create a new comment. Allowed for LEADER and MEMBER only. VIEWER → 403.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Comment created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Content is blank"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "VIEWER cannot post comments"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            @Valid @RequestBody CommentCreateRequest request,
            HttpServletRequest httpRequest) {

        CommentResponse response = commentService.createComment(
                projectId, taskId, request, userId(httpRequest), role(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }
}
