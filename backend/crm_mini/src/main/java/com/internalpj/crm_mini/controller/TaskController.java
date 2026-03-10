package com.internalpj.crm_mini.controller;

import com.internalpj.crm_mini.common.ApiResponse;
import com.internalpj.crm_mini.dto.request.TaskCreateRequest;
import com.internalpj.crm_mini.dto.request.TaskStatusUpdateRequest;
import com.internalpj.crm_mini.dto.request.TaskUpdateRequest;
import com.internalpj.crm_mini.dto.response.TaskListResponse;
import com.internalpj.crm_mini.dto.response.TaskResponse;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.interceptor.ProjectRoleInterceptor;
import com.internalpj.crm_mini.service.TaskService;
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
 * REST controller for managing tasks within a project.
 *
 * <p>
 * All endpoints require the caller to be an active project member.
 * The {@link ProjectRoleInterceptor} runs before each handler and sets:
 * <ul>
 * <li>{@code projectRole} — the caller's {@link ProjectRole}</li>
 * <li>{@code currentUserId} — the caller's user ID</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/projects/{projectId}/tasks")
@Tag(name = "Task Management", description = "APIs for managing tasks within a project")
@SecurityRequirement(name = "bearerAuth")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // ── helpers ──────────────────────────────────────────────────────────────

    private ProjectRole role(HttpServletRequest req) {
        return (ProjectRole) req.getAttribute(ProjectRoleInterceptor.ATTR_PROJECT_ROLE);
    }

    private Long userId(HttpServletRequest req) {
        return (Long) req.getAttribute(ProjectRoleInterceptor.ATTR_CURRENT_USER_ID);
    }

    // ── POST /api/projects/{projectId}/tasks ─────────────────────────────────

    @PostMapping
    @Operation(summary = "Create a task", description = "Create a new task in the project. "
            + "LEADER may set assigneeId; MEMBER always creates with assigneeId = null.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Task created"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a project member"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Valid @RequestBody TaskCreateRequest request,
            HttpServletRequest httpRequest) {

        TaskResponse response = taskService.createTask(projectId, request, userId(httpRequest), role(httpRequest));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    // ── GET /api/projects/{projectId}/tasks ──────────────────────────────────

    @GetMapping
    @Operation(summary = "List tasks", description = "Get a paginated list of tasks in the project, plus status statistics.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tasks retrieved"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a project member"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
    })
    public ResponseEntity<ApiResponse<TaskListResponse>> getTasks(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Page number (0-indexed)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "20") int size,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(ApiResponse.success(taskService.getTasks(projectId, page, size)));
    }

    // ── GET /api/projects/{projectId}/tasks/{taskId} ─────────────────────────

    @GetMapping("/{taskId}")
    @Operation(summary = "Get task detail", description = "Retrieve full details of a single task.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a project member"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(ApiResponse.success(taskService.getTaskById(projectId, taskId)));
    }

    // ── PATCH /api/projects/{projectId}/tasks/{taskId}/status ────────────────

    @PatchMapping("/{taskId}/status")
    @Operation(summary = "Update task status", description = "Any active project member may change a task's status.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Status updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid status value"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Not a project member"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> updateStatus(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            @Valid @RequestBody TaskStatusUpdateRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(ApiResponse.success(
                taskService.updateTaskStatus(projectId, taskId, request)));
    }

    // ── PATCH /api/projects/{projectId}/tasks/{taskId} ───────────────────────

    @PatchMapping("/{taskId}")
    @Operation(summary = "Update task (full update)", description = "Update task fields. Only LEADER may call this endpoint.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task updated"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "LEADER only"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            @Valid @RequestBody TaskUpdateRequest request,
            HttpServletRequest httpRequest) {

        return ResponseEntity.ok(ApiResponse.success(
                taskService.updateTask(projectId, taskId, request, role(httpRequest))));
    }

    // ── DELETE /api/projects/{projectId}/tasks/{taskId} ──────────────────────

    @DeleteMapping("/{taskId}")
    @Operation(summary = "Delete task", description = "Hard-delete a task. Only LEADER may call this endpoint.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Task deleted"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "LEADER only"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Task or project not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @Parameter(description = "Project ID", required = true) @PathVariable Long projectId,
            @Parameter(description = "Task ID", required = true) @PathVariable Long taskId,
            HttpServletRequest httpRequest) {

        taskService.deleteTask(projectId, taskId, role(httpRequest));
        return ResponseEntity.ok(ApiResponse.success());
    }
}
