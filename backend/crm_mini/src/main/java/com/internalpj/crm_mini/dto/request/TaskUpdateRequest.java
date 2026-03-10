package com.internalpj.crm_mini.dto.request;

import com.internalpj.crm_mini.entity.enums.TaskPriority;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Schema(description = "Request body for fully updating a task (LEADER only)")
public class TaskUpdateRequest {

    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    @Schema(description = "New task title", example = "Implement login API v2")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Schema(description = "New task description")
    private String description;

    @Schema(description = "New priority", example = "CRITICAL")
    private TaskPriority priority;

    @Schema(description = "New assignee user ID (null to unassign)", example = "7")
    private Long assigneeId;

    @Schema(description = "New due date/time", example = "2026-05-01T18:00:00")
    private LocalDateTime dueDate;
}
