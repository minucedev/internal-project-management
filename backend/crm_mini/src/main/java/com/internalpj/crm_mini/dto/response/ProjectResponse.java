package com.internalpj.crm_mini.dto.response;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for project response with user's role.
 * Used in project list and single project responses.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Creator information
    private Long createdById;
    private String createdByUsername;

    // Current user's role in this project
    private ProjectRole currentUserRole;

    // Statistics
    private Long memberCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
