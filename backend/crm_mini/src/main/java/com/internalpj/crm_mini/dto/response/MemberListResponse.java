package com.internalpj.crm_mini.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for member list response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberListResponse {

    private List<MemberResponse> members;
    private Long totalMembers;
    private Long activeCount;
    private Long pendingCount;

    // Statistics by role
    private Long leaderCount;
    private Long memberCount;
    private Long viewerCount;
}
