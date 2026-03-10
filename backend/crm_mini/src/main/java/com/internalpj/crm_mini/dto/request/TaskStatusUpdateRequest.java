package com.internalpj.crm_mini.dto.request;

import com.internalpj.crm_mini.entity.enums.TaskStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Request body for updating a task's status")
public class TaskStatusUpdateRequest {

    @NotNull(message = "Status is required")
    @Schema(description = "New task status", example = "IN_PROGRESS", allowableValues = { "TODO", "IN_PROGRESS", "DONE",
            "CANCELLED" }, requiredMode = Schema.RequiredMode.REQUIRED)
    private TaskStatus status;
}
