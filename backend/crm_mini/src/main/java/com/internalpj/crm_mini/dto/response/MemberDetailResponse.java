package com.internalpj.crm_mini.dto.response;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO for member details with user information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDetailResponse {

    private Long userId;
    private String username;
    private String email;
    private String avatarUrl;
    private String phoneNumber;
    private ProjectRole roleInProject;
    private String positionTitle;
    private ProjectUserStatus statusInProject;
    private LocalDateTime joinedAt;

    /**
     * Only populated for PENDING invitations.
     */
    private LocalDateTime inviteExpiry;
}
