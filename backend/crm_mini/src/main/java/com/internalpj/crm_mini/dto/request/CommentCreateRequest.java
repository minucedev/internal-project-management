package com.internalpj.crm_mini.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Request body for creating a comment on a task")
public class CommentCreateRequest {

    @NotBlank(message = "Comment content is required")
    @Schema(description = "Comment text", example = "Need more info on this task", requiredMode = Schema.RequiredMode.REQUIRED)
    private String content;
}
