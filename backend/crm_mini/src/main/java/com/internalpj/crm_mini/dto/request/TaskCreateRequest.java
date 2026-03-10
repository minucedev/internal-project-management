package com.internalpj.crm_mini.dto.request;

import com.internalpj.crm_mini.entity.enums.TaskPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Request body for creating a new task")
public class TaskCreateRequest {

    @NotBlank(message = "Task title is required")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    @Schema(description = "Task title", example = "Implement login API", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Schema(description = "Task description", example = "Build the JWT-based login endpoint")
    private String description;

    @Schema(description = "Task priority. Defaults to MEDIUM", example = "HIGH")
    private TaskPriority priority = TaskPriority.MEDIUM;

    @Schema(description = "ID of the user to assign this task to (LEADER only — ignored for MEMBER role)", example = "5")
    private Long assigneeId;

    @Schema(description = "Optional due date/time", example = "2026-04-01T18:00:00")
    private LocalDateTime dueDate;
}
