package com.internalpj.crm_mini.controller;

import com.internalpj.crm_mini.common.ApiResponse;
import com.internalpj.crm_mini.dto.request.ProjectCreateRequest;
import com.internalpj.crm_mini.dto.request.ProjectUpdateRequest;
import com.internalpj.crm_mini.dto.response.ProjectDetailResponse;
import com.internalpj.crm_mini.dto.response.ProjectListResponse;
import com.internalpj.crm_mini.dto.response.ProjectResponse;
import com.internalpj.crm_mini.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for Project management operations.
 * Handles CRUD operations for projects.
 */
@RestController
@RequestMapping("/api/projects")
@Tag(name = "Project Management", description = "APIs for managing projects including creation, listing, and detailed views")
@SecurityRequirement(name = "bearerAuth")
public class ProjectController {

        private final ProjectService projectService;

        public ProjectController(ProjectService projectService) {
                this.projectService = projectService;
        }

        /**
         * Create a new project.
         * The creator is automatically added as LEADER.
         * 
         * @param request the project creation request
         * @return the created project with creator's role
         */
        @PostMapping
        @Operation(summary = "Create a new project", description = "Creates a new project and automatically adds the creator as LEADER. "
                        +
                        "Project name is required (1-100 chars). If dates provided, endDate must be after startDate.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Project created successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input - validation failed or business rule violated"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid authentication token"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Current user not found")
        })
        public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
                        @Valid @RequestBody ProjectCreateRequest request) {

                return ResponseEntity
                                .status(HttpStatus.CREATED)
                                .body(ApiResponse.success(projectService.createProject(request)));
        }

        /**
         * Get all projects that the current user is a member of.
         * Supports pagination, filtering by role, and sorting.
         * 
         * @param page page number (0-indexed)
         * @param size page size
         * @param role optional filter by role (LEADER, MEMBER, VIEWER)
         * @param sort optional sort field (default: createdAt)
         * @return paginated list of projects
         */
        @GetMapping
        @Operation(summary = "Get user's projects", description = "Retrieves all projects where the current user is an active member. "
                        +
                        "Supports pagination, filtering by role (LEADER/MEMBER/VIEWER), and sorting (name/startDate/endDate/createdAt).")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved projects list", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectListResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid role parameter"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized")
        })
        public ResponseEntity<ApiResponse<ProjectListResponse>> getProjects(
                        @Parameter(description = "Page number (0-indexed)", example = "0") @RequestParam(defaultValue = "0") int page,

                        @Parameter(description = "Items per page (1-100)", example = "10") @RequestParam(defaultValue = "10") int size,

                        @Parameter(description = "Filter by role: LEADER, MEMBER, or VIEWER", example = "LEADER") @RequestParam(required = false) String role,

                        @Parameter(description = "Sort by: name, startDate, endDate, or createdAt (default)", example = "createdAt") @RequestParam(defaultValue = "createdAt") String sort) {

                return ResponseEntity.ok(
                                ApiResponse.success(projectService.getProjects(page, size, role, sort)));
        }

        /**
         * Get detailed information about a specific project.
         * User must be a member of the project to view details.
         * 
         * @param id the project ID
         * @return detailed project information with members list
         */
        @GetMapping("/{id}")
        @Operation(summary = "Get project details", description = "Retrieves detailed information about a specific project including full members list, "
                        +
                        "role statistics, and metadata. User must be an active member to access.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Successfully retrieved project details", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectDetailResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - user is not a member of this project"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
        })
        public ResponseEntity<ApiResponse<ProjectDetailResponse>> getProjectDetail(
                        @Parameter(description = "Project ID", required = true, example = "1") @PathVariable Long id) {

                return ResponseEntity.ok(
                                ApiResponse.success(projectService.getProjectDetail(id)));
        }

        /**
         * Update an existing project.
         * Only LEADER can update project details.
         * 
         * @param id      the project ID
         * @param request the update request
         * @return the updated project response
         */
        @PutMapping("/{id}")
        @Operation(summary = "Update project", description = "Updates project details (name, description, endDate). "
                        +
                        "Only LEADER can update. Supports partial updates - only provided fields will be updated.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Project updated successfully", content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ProjectResponse.class))),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Invalid input - validation failed or business rule violated"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid authentication token"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - only LEADER can update projects"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
        })
        public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
                        @Parameter(description = "Project ID", required = true, example = "1") @PathVariable Long id,
                        @Valid @RequestBody ProjectUpdateRequest request) {

                return ResponseEntity.ok(
                                ApiResponse.success(projectService.updateProject(id, request)));
        }

        /**
         * Delete a project (soft or hard delete).
         * Only LEADER can delete projects.
         * 
         * @param id         the project ID
         * @param hardDelete if true, permanently delete; if false (default), move to
         *                   trash
         * @return success message
         */
        @DeleteMapping("/{id}")
        @Operation(summary = "Delete project", description = "Deletes a project. By default (hardDelete=false), moves to trash. "
                        +
                        "Set hardDelete=true to permanently delete. Only LEADER can delete.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Project deleted successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid authentication token"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - only LEADER can delete projects"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
        })
        public ResponseEntity<ApiResponse<String>> deleteProject(
                        @Parameter(description = "Project ID", required = true, example = "1") @PathVariable Long id,
                        @Parameter(description = "Hard delete (permanent)", example = "false") @RequestParam(defaultValue = "false") boolean hardDelete) {

                projectService.deleteProject(id, hardDelete);
                String message = hardDelete ? "Project permanently deleted" : "Project moved to trash";
                return ResponseEntity.ok(
                                ApiResponse.success(message));
        }

        /**
         * Restore a project from trash.
         * Only LEADER can restore projects.
         * 
         * @param id the project ID
         * @return the restored project
         */
        @PostMapping("/{id}/restore")
        @Operation(summary = "Restore project from trash", description = "Restores a deleted project and reactivates all members. Only LEADER can restore.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Project restored successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Project is not in trash"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid authentication token"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Forbidden - only LEADER can restore projects"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Project not found")
        })
        public ResponseEntity<ApiResponse<ProjectResponse>> restoreProject(
                        @Parameter(description = "Project ID", required = true, example = "1") @PathVariable Long id) {

                return ResponseEntity.ok(
                                ApiResponse.success(projectService.restoreProject(id)));
        }

        /**
         * Get all trashed projects where current user is LEADER.
         * 
         * @return list of trashed projects
         */
        @GetMapping("/trashed")
        @Operation(summary = "List trashed projects", description = "Get all projects in trash where user is LEADER.")
        @ApiResponses(value = {
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Trashed projects retrieved successfully"),
                        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "Unauthorized - missing or invalid authentication token")
        })
        public ResponseEntity<ApiResponse<java.util.List<ProjectResponse>>> getTrashedProjects() {
                return ResponseEntity.ok(
                                ApiResponse.success(projectService.getTrashedProjects()));
        }
}
