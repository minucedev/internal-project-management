package com.internalpj.crm_mini.dto.response;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for member list response with pagination support.
 * Used by both MemberService and potentially ProjectService.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberListResponse {

    private List<MemberResponse> members;
    
    // Member statistics
    private Long totalMembers;
    private Long activeCount;
    private Long pendingCount;

    // Statistics by role (active members only)
    private Long leaderCount;
    private Long memberCount;
    private Long viewerCount;
    
    // Pagination metadata (optional)
    private Integer currentPage;
    private Integer pageSize;
    private Integer totalPages;
    private Boolean hasNext;
    private Boolean hasPrevious;
}
