package com.internalpj.crm_mini.dto.response;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for member response.
 * Contains user info and their role/status in the project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponse {

    // User information
    private Long userId;
    private String username;
    private String email;
    private String phoneNumber;

    // Project membership information
    private ProjectRole roleInProject;
    private String positionTitle;
    private ProjectUserStatus statusInProject;
    private LocalDateTime joinedAt;
}
