package com.internalpj.crm_mini.dto.response;

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
@Schema(description = "Comment detail response")
public class CommentResponse {

    @Schema(description = "Comment ID", example = "1")
    private Long id;

    @Schema(description = "Comment text", example = "Need more info on this task")
    private String content;

    @Schema(description = "Author of the comment")
    private CommentUserInfo user;

    @Schema(description = "Timestamp when the comment was created")
    private LocalDateTime createdAt;

    // ── nested ───────────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Compact user info embedded in a comment")
    public static class CommentUserInfo {

        @Schema(description = "User ID", example = "5")
        private Long id;

        @Schema(description = "Username", example = "john_dev")
        private String username;

        @Schema(description = "Email address", example = "john@company.com")
        private String email;

        /**
         * Avatar URL generated from DiceBear using the username as seed.
         * Example: https://api.dicebear.com/7.x/avataaars/svg?seed=john_dev
         */
        @Schema(description = "Avatar URL (DiceBear, derived from username)", example = "https://api.dicebear.com/7.x/avataaars/svg?seed=john_dev")
        private String avatarUrl;
    }
}
