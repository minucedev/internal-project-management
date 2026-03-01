package com.internalpj.crm_mini.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.internalpj.crm_mini.dto.request.ProjectCreateRequest;
import com.internalpj.crm_mini.dto.request.ProjectUpdateRequest;
import com.internalpj.crm_mini.dto.response.MemberResponse;
import com.internalpj.crm_mini.dto.response.ProjectDetailResponse;
import com.internalpj.crm_mini.dto.response.ProjectListResponse;
import com.internalpj.crm_mini.dto.response.ProjectResponse;
import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.ProjectUserId;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import com.internalpj.crm_mini.exception.BadRequestException;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.mapper.MemberMapper;
import com.internalpj.crm_mini.mapper.ProjectMapper;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.ProjectUserRepository;
import com.internalpj.crm_mini.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing projects.
 * Handles business logic for project CRUD operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectUserRepository projectUserRepository;
    private final UserRepository userRepository;
    private final ProjectMapper projectMapper;
    private final MemberMapper memberMapper;
    private final ProjectSecurityService securityService;

    /**
     * Create a new project.
     * 
     * Business logic:
     * 1. Validate input (dates, name length)
     * 2. Get current user from SecurityContext
     * 3. Create project entity
     * 4. Save project to database
     * 5. Automatically add creator as LEADER
     * 6. Return project response with role
     * 
     * @param request the project creation request
     * @return the created project response
     * @throws NotFoundException   if current user not found
     * @throws BadRequestException if validation fails
     */
    @Transactional
    public ProjectResponse createProject(ProjectCreateRequest request) {
        log.info("Creating new project: {}", request.getName());

        // 1. Validate dates
        validateProjectDates(request.getStartDate(), request.getEndDate());

        // 2. Get current user
        Long currentUserId = securityService.getCurrentUserId();
        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> NotFoundException.user());

        // 3. Create project entity
        Project project = projectMapper.toEntity(request);
        project.setCreatedBy(creator);

        // 4. Save project (this will trigger @PrePersist)
        Project savedProject = projectRepository.save(project);
        log.info("Project created with ID: {}", savedProject.getId());

        // 5. Automatically add creator as LEADER
        addCreatorAsLeader(savedProject, creator);

        // 6. Get member count (should be 1 at this point)
        long memberCount = projectUserRepository.countActiveMembersByProjectId(savedProject.getId());

        // 7. Return response
        ProjectResponse response = projectMapper.toResponse(
                savedProject,
                ProjectRole.LEADER,
                memberCount);

        log.info("Project created successfully: {} (ID: {})", savedProject.getName(), savedProject.getId());
        return response;
    }

    /**
     * Add the project creator as LEADER.
     * This is called automatically when a project is created.
     * 
     * @param project the created project
     * @param creator the user who created the project
     */
    private void addCreatorAsLeader(Project project, User creator) {
        ProjectUserId id = new ProjectUserId(project.getId(), creator.getId());

        ProjectUser projectUser = ProjectUser.builder()
                .id(id)
                .project(project)
                .user(creator)
                .roleInProject(ProjectRole.LEADER)
                .statusInProject(ProjectUserStatus.ACTIVE)
                .build();

        projectUserRepository.save(projectUser);
        log.info("Added user {} as LEADER of project {}", creator.getUsername(), project.getId());
    }

    /**
     * Validate project dates.
     * 
     * @param startDate the start date
     * @param endDate   the end date
     * @throws BadRequestException if dates are invalid
     */
    private void validateProjectDates(java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        if (startDate != null && endDate != null) {
            if (endDate.isBefore(startDate)) {
                throw BadRequestException.invalidDateRange();
            }
        }
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
    public ProjectListResponse getProjects(int page, int size, String role, String sort) {
        log.info("Getting projects for current user - page: {}, size: {}, role: {}, sort: {}",
                page, size, role, sort);

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        // Create Pageable with dynamic sorting
        Sort sortObj = createSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortObj);

        // Get paginated results from repository with JOIN FETCH
        Page<ProjectUser> projectUserPage = projectUserRepository
                .findByIdUserIdAndStatusInProjectWithPagination(
                        currentUserId, ProjectUserStatus.ACTIVE, pageable);

        // Apply role filtering if specified
        List<ProjectUser> filteredProjectUsers = applyRoleFilter(projectUserPage.getContent(), role);

        // Build response with batch member counting to avoid N+1
        ProjectListResponse response = buildProjectListResponse(
                filteredProjectUsers, projectUserPage);

        log.info("Found {} projects for user {} (page {}/{}, total: {})",
                filteredProjectUsers.size(), currentUserId,
                projectUserPage.getNumber() + 1, projectUserPage.getTotalPages(),
                projectUserPage.getTotalElements());
        return response;
    }

    /**
     * Apply role filtering to project users list.
     *
     * @param projectUsers the list to filter
     * @param role         the role filter (nullable)
     * @return filtered list
     */
    private List<ProjectUser> applyRoleFilter(List<ProjectUser> projectUsers, String role) {
        if (role == null || role.trim().isEmpty()) {
            return projectUsers;
        }

        try {
            ProjectRole filterRole = ProjectRole.valueOf(role.toUpperCase().trim());
            return projectUsers.stream()
                    .filter(pu -> pu.getRoleInProject() == filterRole)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw BadRequestException.invalidRole(role);
        }
    }

    /**
     * Build project list response with batch member counting to avoid N+1 queries.
     *
     * @param filteredProjectUsers the filtered project users
     * @param projectUserPage      the original page for metadata
     * @return complete project list response
     */
    private ProjectListResponse buildProjectListResponse(
            List<ProjectUser> filteredProjectUsers, Page<ProjectUser> projectUserPage) {

        // Extract project IDs for batch member counting
        List<Long> projectIds = filteredProjectUsers.stream()
                .map(pu -> pu.getProject().getId())
                .collect(Collectors.toList());

        // Batch count members to avoid N+1 queries
        Map<Long, Long> memberCountMap = batchCountMembers(projectIds);

        // Convert to ProjectResponse DTOs
        List<ProjectResponse> projectResponses = filteredProjectUsers.stream()
                .map(pu -> {
                    Project project = pu.getProject();
                    long memberCount = memberCountMap.getOrDefault(project.getId(), 0L);
                    return projectMapper.toResponse(project, pu.getRoleInProject(), memberCount);
                })
                .collect(Collectors.toList());

        // Build pagination response using Page metadata
        return ProjectListResponse.builder()
                .projects(projectResponses)
                .currentPage(projectUserPage.getNumber())
                .pageSize(projectUserPage.getSize())
                .totalElements((int) projectUserPage.getTotalElements())
                .totalPages(projectUserPage.getTotalPages())
                .hasNext(projectUserPage.hasNext())
                .hasPrevious(projectUserPage.hasPrevious())
                .build();
    }

    /**
     * Batch count members for multiple projects to avoid N+1 queries.
     *
     * @param projectIds list of project IDs
     * @return map of project ID to member count
     */
    private Map<Long, Long> batchCountMembers(List<Long> projectIds) {
        if (projectIds.isEmpty()) {
            return Map.of();
        }

        return projectUserRepository.batchCountActiveMembersByProjectIds(projectIds)
                .stream()
                .collect(Collectors.toMap(
                        ProjectUserRepository.ProjectMemberCount::getProjectId,
                        ProjectUserRepository.ProjectMemberCount::getMemberCount));
    }

    /**
     * Create Sort object based on sort parameter.
     * Supports dynamic sorting by project fields.
     *
     * @param sort the sort field name (case-insensitive)
     * @return Sort object for Spring Data
     */
    private Sort createSort(String sort) {
        if (sort == null || sort.trim().isEmpty()) {
            sort = "createdAt";
        }

        Sort.Direction direction = Sort.Direction.ASC;
        String sortField = sort.toLowerCase().trim();

        // Handle descending sorts (fields ending with "desc")
        if (sortField.endsWith(" desc")) {
            direction = Sort.Direction.DESC;
            sortField = sortField.substring(0, sortField.length() - 5).trim();
        }

        // Map sort field to actual entity property path
        String propertyPath;
        switch (sortField) {
            case "name":
                propertyPath = "project.name";
                break;
            case "startdate":
                propertyPath = "project.startDate";
                break;
            case "enddate":
                propertyPath = "project.endDate";
                break;
            case "createdat":
            default:
                propertyPath = "project.createdAt";
                direction = Sort.Direction.DESC; // Default to newest first
                break;
        }

        return Sort.by(direction, propertyPath);
    }

    /**
     * Get detailed information about a specific project.
     * User must be a member of the project to view details.
     * 
     * @param id the project ID
     * @return detailed project information with members list
     * @throws NotFoundException  if project not found
     * @throws ForbiddenException if user is not a member
     */
    public ProjectDetailResponse getProjectDetail(Long id) {
        log.info("Getting project detail for project ID: {}", id);

        Long currentUserId = securityService.getCurrentUserId();

        // Validate membership and get user role
        ProjectMembershipInfo membershipInfo = validateMembershipAndGetRole(id, currentUserId);

        // Get members with user data fetched to avoid lazy loading
        List<MemberResponse> memberResponses = getProjectMembersWithUsers(id);

        // Calculate role statistics efficiently
        ProjectMapper.RoleStatistics statistics = calculateRoleStatistics(id);

        // Build detail response
        ProjectDetailResponse response = projectMapper.toDetailResponse(
                membershipInfo.project(), membershipInfo.userRole(), memberResponses, statistics);

        log.info("Retrieved project detail for project: {} (ID: {})",
                membershipInfo.project().getName(), id);
        return response;
    }

    /**
     * Validate user membership and get role information.
     *
     * @param projectId     the project ID
     * @param currentUserId the current user ID
     * @return membership info with project and user role
     * @throws NotFoundException  if project not found
     * @throws ForbiddenException if user is not a member
     */
    private ProjectMembershipInfo validateMembershipAndGetRole(Long projectId, Long currentUserId) {
        // Check if project exists
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> NotFoundException.project(projectId));

        // Check if user is an active member
        if (!projectUserRepository.isActiveMember(projectId, currentUserId)) {
            throw ForbiddenException.notProjectMember();
        }

        // Get user's role in the project
        ProjectRole currentUserRole = projectUserRepository
                .findRoleByProjectIdAndUserId(projectId, currentUserId)
                .orElse(ProjectRole.VIEWER);

        return new ProjectMembershipInfo(project, currentUserRole);
    }

    /**
     * Get project members with user data fetched to avoid N+1 queries.
     * NOW USES REUSABLE REPOSITORY QUERY.
     *
     * @param projectId the project ID
     * @return list of member responses
     */
    private List<MemberResponse> getProjectMembersWithUsers(Long projectId) {
        // Use reusable query with JOIN FETCH to avoid lazy loading of users
        List<ProjectUser> activeMembers = projectUserRepository
                .findActiveMembersWithUsers(projectId); // This now uses the reusable method

        // Convert to MemberResponse DTOs
        return memberMapper.toResponseList(activeMembers);
    }

    /**
     * Calculate role statistics for a project.
     * NOW USES REUSABLE REPOSITORY QUERY for better performance.
     *
     * @param projectId the project ID
     * @return role statistics
     */
    private ProjectMapper.RoleStatistics calculateRoleStatistics(Long projectId) {
        // Use single reusable query instead of separate queries
        ProjectUserRepository.MemberStatistics stats = projectUserRepository.getMemberStatistics(projectId);

        return new ProjectMapper.RoleStatistics(
                stats.getActiveCount(), // totalMembers (active only)
                stats.getActiveLeaderCount(),
                stats.getActiveMemberCount(),
                stats.getActiveViewerCount());
    }

    /**
     * Record for project membership validation results.
     */
    private record ProjectMembershipInfo(Project project, ProjectRole userRole) {
    }

    /**
     * Update an existing project.
     * Only LEADER can update project details.
     * 
     * @param projectId the project ID to update
     * @param request   the update request with new values
     * @return the updated project response
     * @throws NotFoundException   if project not found
     * @throws ForbiddenException  if user is not a LEADER
     * @throws BadRequestException if validation fails
     */
    @Transactional
    public ProjectResponse updateProject(Long projectId, ProjectUpdateRequest request) {
        log.info("Updating project ID: {}", projectId);

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        // Check authorization: only LEADER can update
        securityService.requireLeader(projectId, currentUserId);

        // Get the project
        Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                .orElseThrow(() -> NotFoundException.project(projectId));

        // Validate endDate if provided
        if (request.getEndDate() != null && project.getStartDate() != null) {
            validateProjectDates(project.getStartDate(), request.getEndDate());
        }

        // Update project fields using mapper (only non-null fields)
        projectMapper.updateFromRequest(request, project);

        // Save updated project
        Project updatedProject = projectRepository.save(project);

        // Get current user's role and member count for response
        ProjectRole currentUserRole = securityService.getUserRoleInProject(projectId, currentUserId);
        Long memberCount = projectUserRepository.countActiveMembersByProjectId(projectId);

        log.info("Successfully updated project: {} (ID: {})", updatedProject.getName(), projectId);
        return projectMapper.toResponse(updatedProject, currentUserRole, memberCount);
    }

    /**
     * Delete a project (soft or hard delete).
     * Only LEADER can delete projects.
     * 
     * @param projectId  the project ID to delete
     * @param hardDelete if true, permanently delete; if false, move to trash
     * @throws NotFoundException  if project not found
     * @throws ForbiddenException if user is not a LEADER
     */
    @Transactional
    public void deleteProject(Long projectId, boolean hardDelete) {
        log.info("Deleting project ID: {} (hardDelete: {})", projectId, hardDelete);

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        if (hardDelete) {
            // Permanent delete (can delete soft-deleted projects)
            Project project = projectRepository.findByIdIncludingDeleted(projectId)
                    .orElseThrow(() -> NotFoundException.project(projectId));

            // Check authorization: only LEADER can delete (ignore status for soft-deleted
            // projects)
            securityService.checkUserIsLeaderIgnoreStatus(projectId, currentUserId);

            projectRepository.delete(project);
            log.warn("HARD DELETE: Project {} (ID: {}) permanently deleted by user {}",
                    project.getName(), projectId, currentUserId);
        } else {
            // Soft delete (move to trash) - only for non-deleted projects
            // Check authorization: only LEADER can delete
            securityService.requireLeader(projectId, currentUserId);

            Project project = projectRepository.findByIdAndDeletedAtIsNull(projectId)
                    .orElseThrow(() -> NotFoundException.project(projectId));

            project.softDelete();
            projectRepository.save(project);
            log.info("Soft deleted project: {} (ID: {})", project.getName(), projectId);
        }
    }

    /**
     * Restore a project from trash.
     * Only LEADER can restore projects.
     * 
     * @param projectId the project ID to restore
     * @return the restored project response
     * @throws NotFoundException   if project not found
     * @throws BadRequestException if project is not in trash
     * @throws ForbiddenException  if user is not a LEADER
     */
    @Transactional
    public ProjectResponse restoreProject(Long projectId) {
        log.info("Restoring project ID: {}", projectId);

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        // Find project including deleted ones
        Project project = projectRepository.findByIdIncludingDeleted(projectId)
                .orElseThrow(() -> NotFoundException.project(projectId));

        // Check if project is actually deleted
        if (project.getDeletedAt() == null) {
            throw BadRequestException.projectNotInTrash();
        }

        // Check authorization: only LEADER can restore
        // NOTE: requireLeader() won't work here because it internally calls
        // checkProjectExists()
        // which filters by deletedAt IS NULL — this project IS deleted, so it would
        // throw 404.
        // Use checkUserIsLeaderIgnoreStatus() which bypasses the deleted check.
        securityService.checkUserIsLeaderIgnoreStatus(projectId, currentUserId);

        // Restore the project
        project.restore();
        Project restored = projectRepository.save(project);

        // Get member count
        int memberCount = restored.getProjectUsers().size();

        log.info("Successfully restored project: {} (ID: {})", restored.getName(), projectId);
        return projectMapper.toResponse(restored, ProjectRole.LEADER, (long) memberCount);
    }

    /**
     * Get all trashed projects where current user is LEADER.
     * 
     * @return list of trashed projects
     */
    public List<ProjectResponse> getTrashedProjects() {
        log.info("Getting trashed projects for current user");

        Long currentUserId = securityService.getCurrentUserId();

        // Use projection query with member count to avoid N+1 queries
        List<ProjectRepository.TrashedProjectSummary> trashedProjectSummaries = projectRepository
                .findTrashedProjectsWithMemberCount(currentUserId);

        return trashedProjectSummaries.stream()
                .map(this::buildProjectResponseFromSummary)
                .collect(Collectors.toList());
    }

    /**
     * Build ProjectResponse from TrashedProjectSummary.
     *
     * @param summary the project summary
     * @return project response
     */
    private ProjectResponse buildProjectResponseFromSummary(ProjectRepository.TrashedProjectSummary summary) {
        return ProjectResponse.builder()
                .id(summary.getProjectId())
                .name(summary.getName())
                .description(summary.getDescription())
                .startDate(summary.getStartDate())
                .endDate(summary.getEndDate())
                .currentUserRole(ProjectRole.LEADER)
                .memberCount(summary.getMemberCount())
                .createdAt(summary.getCreatedAt())
                .updatedAt(summary.getUpdatedAt())
                .build();
    }
}
