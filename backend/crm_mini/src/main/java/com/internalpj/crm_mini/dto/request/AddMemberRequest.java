package com.internalpj.crm_mini.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for adding a member to a project.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddMemberRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Size(max = 100, message = "Position title must not exceed 100 characters")
    private String positionTitle;
}
