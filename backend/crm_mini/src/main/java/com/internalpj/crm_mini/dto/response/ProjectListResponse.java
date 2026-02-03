package com.internalpj.crm_mini.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.Page;

import java.util.List;

/**
 * DTO for paginated project list response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectListResponse {

    private List<ProjectResponse> projects;

    // Pagination info
    private int currentPage;
    private int pageSize;
    private long totalElements;
    private int totalPages;
    private boolean hasNext;
    private boolean hasPrevious;

    /**
     * Create from Spring Data Page object.
     */
    public static ProjectListResponse from(Page<ProjectResponse> page) {
        return ProjectListResponse.builder()
                .projects(page.getContent())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .hasNext(page.hasNext())
                .hasPrevious(page.hasPrevious())
                .build();
    }
}
