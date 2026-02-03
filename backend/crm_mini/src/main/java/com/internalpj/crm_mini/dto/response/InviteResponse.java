package com.internalpj.crm_mini.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for invitation creation.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteResponse {

    private Long userId;
    private String email;
    private String inviteToken;
    private LocalDateTime expiresAt;
    private String message;
}
