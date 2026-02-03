package com.internalpj.crm_mini.dto.response;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for detailed project response.
 * Includes full project info, members list, and statistics.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectDetailResponse {

    private Long id;
    private String name;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    // Creator information
    private Long createdById;
    private String createdByUsername;
    private String createdByEmail;

    // Current user's role in this project
    private ProjectRole currentUserRole;

    // Members list (limited to first 10, use separate endpoint for full list)
    private List<MemberResponse> members;

    // Statistics
    private Long totalMembers;
    private Long leaderCount;
    private Long memberCount;
    private Long viewerCount;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
