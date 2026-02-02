package com.internalpj.crm_mini.dto.request;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for inviting a member to a project.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteMemberRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 100, message = "Position title must not exceed 100 characters")
    private String positionTitle;

    /**
     * Role to assign (default: MEMBER).
     * Only LEADER can assign LEADER role.
     */
    private ProjectRole role;
}
