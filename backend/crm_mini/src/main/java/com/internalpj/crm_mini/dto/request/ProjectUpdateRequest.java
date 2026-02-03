package com.internalpj.crm_mini.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for updating an existing project.
 * All fields are optional - only provided fields will be updated.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectUpdateRequest {

    @Size(min = 3, max = 200, message = "Project name must be between 3 and 200 characters")
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    private LocalDateTime endDate;
}
