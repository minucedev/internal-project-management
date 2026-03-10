package com.internalpj.crm_mini.dto.response;

import com.internalpj.crm_mini.entity.enums.TaskPriority;
import com.internalpj.crm_mini.entity.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Task detail response")
public class TaskResponse {

    @Schema(description = "Task ID", example = "1")
    private Long id;

    @Schema(description = "Task title", example = "Implement login API")
    private String title;

    @Schema(description = "Task description")
    private String description;

    @Schema(description = "Current status", example = "TODO")
    private TaskStatus status;

    @Schema(description = "Priority level", example = "HIGH")
    private TaskPriority priority;

    @Schema(description = "ID of the project this task belongs to", example = "10")
    private Long projectId;

    @Schema(description = "ID of the assigned user (null if unassigned)", example = "5")
    private Long assigneeId;

    @Schema(description = "Username of the assigned user (null if unassigned)", example = "johndoe")
    private String assigneeUsername;

    @Schema(description = "ID of the user who created the task", example = "3")
    private Long createdById;

    @Schema(description = "Username of the user who created the task", example = "janedoe")
    private String createdByUsername;

    @Schema(description = "Optional due date/time", example = "2026-04-01T18:00:00")
    private LocalDateTime dueDate;

    @Schema(description = "Task creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "Task last-updated timestamp")
    private LocalDateTime updatedAt;
}
