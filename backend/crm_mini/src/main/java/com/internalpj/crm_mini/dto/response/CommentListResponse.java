package com.internalpj.crm_mini.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "List of comments for a task")
public class CommentListResponse {

    @Schema(description = "Comments sorted oldest → newest")
    private List<CommentResponse> comments;

    @Schema(description = "ID of the task the comments belong to", example = "123")
    private Long taskId;

    @Schema(description = "Total number of comments", example = "5")
    private int total;
}
