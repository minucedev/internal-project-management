package com.internalpj.crm_mini.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Paginated list of tasks with statistics")
public class TaskListResponse {

    @Schema(description = "List of tasks for the current page")
    private List<TaskResponse> tasks;

    @Schema(description = "Task count broken down by status")
    private TaskStatistics statistics;

    @Schema(description = "Pagination metadata")
    private PaginationInfo pagination;

    // ── nested types ─────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Task count statistics by status")
    public static class TaskStatistics {
        @Schema(description = "Total number of tasks in the project", example = "20")
        private long total;

        @Schema(description = "Tasks with status TODO", example = "8")
        private long todo;

        @Schema(description = "Tasks with status IN_PROGRESS", example = "5")
        private long inProgress;

        @Schema(description = "Tasks with status DONE", example = "6")
        private long done;

        @Schema(description = "Tasks with status CANCELLED", example = "1")
        private long cancelled;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "Pagination metadata")
    public static class PaginationInfo {
        @Schema(description = "Current page number (0-indexed)", example = "0")
        private int page;

        @Schema(description = "Number of items per page", example = "20")
        private int size;

        @Schema(description = "Total number of tasks matching the query", example = "20")
        private long totalElements;

        @Schema(description = "Total number of pages", example = "1")
        private int totalPages;
    }
}
