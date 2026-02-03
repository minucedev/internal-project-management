package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.dto.request.ProjectCreateRequest;
import com.internalpj.crm_mini.dto.request.ProjectUpdateRequest;
import com.internalpj.crm_mini.dto.response.ProjectDetailResponse;
import com.internalpj.crm_mini.dto.response.ProjectListResponse;
import com.internalpj.crm_mini.dto.response.ProjectResponse;
import com.internalpj.crm_mini.dto.response.MemberResponse;
import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.ProjectUserId;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import com.internalpj.crm_mini.exception.BadRequestException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.mapper.ProjectMapper;
import com.internalpj.crm_mini.mapper.MemberMapper;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.ProjectUserRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
                .orElseThrow(() -> new NotFoundException("User", currentUserId));

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

        // Get all active project memberships for the user
        List<ProjectUser> projectUsers = projectUserRepository
                .findByIdUserIdAndStatusInProject(currentUserId, ProjectUserStatus.ACTIVE);

        // Filter by role if specified
        if (role != null && !role.isEmpty()) {
            try {
                ProjectRole filterRole = ProjectRole.valueOf(role.toUpperCase());
                projectUsers = projectUsers.stream()
                        .filter(pu -> pu.getRoleInProject() == filterRole)
                        .collect(java.util.stream.Collectors.toList());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid role: " + role);
            }
        }

        // Sort the projects
        java.util.Comparator<ProjectUser> comparator;
        switch (sort.toLowerCase()) {
            case "name":
                comparator = java.util.Comparator.comparing(pu -> pu.getProject().getName());
                break;
            case "startdate":
                comparator = java.util.Comparator.comparing(
                        pu -> pu.getProject().getStartDate(),
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                break;
            case "enddate":
                comparator = java.util.Comparator.comparing(
                        pu -> pu.getProject().getEndDate(),
                        java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                break;
            case "createdat":
            default:
                comparator = java.util.Comparator.comparing(
                        pu -> pu.getProject().getCreatedAt(),
                        java.util.Comparator.reverseOrder());
                break;
        }
        projectUsers.sort(comparator);

        // Apply pagination manually
        int start = page * size;
        int end = Math.min(start + size, projectUsers.size());
        List<ProjectUser> paginatedProjectUsers = projectUsers.subList(
                Math.min(start, projectUsers.size()),
                Math.min(end, projectUsers.size()));

        // Convert to ProjectResponse DTOs
        List<ProjectResponse> projectResponses = paginatedProjectUsers.stream()
                .map(pu -> {
                    Project project = pu.getProject();
                    long memberCount = projectUserRepository.countActiveMembersByProjectId(project.getId());
                    return projectMapper.toResponse(project, pu.getRoleInProject(), memberCount);
                })
                .collect(java.util.stream.Collectors.toList());

        // Build pagination response
        int totalElements = projectUsers.size();
        int totalPages = (int) Math.ceil((double) totalElements / size);

        ProjectListResponse response = ProjectListResponse.builder()
                .projects(projectResponses)
                .currentPage(page)
                .pageSize(size)
                .totalElements(totalElements)
                .totalPages(totalPages)
                .hasNext(page < totalPages - 1)
                .hasPrevious(page > 0)
                .build();

        log.info("Found {} projects for user {}", totalElements, currentUserId);
        return response;
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

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        // Check if project exists
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Project", id));

        // Check if user is an active member
        if (!projectUserRepository.isActiveMember(id, currentUserId)) {
            throw new ForbiddenException("You are not a member of this project");
        }

        // Get user's role in the project
        ProjectRole currentUserRole = projectUserRepository
                .findRoleByProjectIdAndUserId(id, currentUserId)
                .orElse(ProjectRole.VIEWER);

        // Get all active members
        List<ProjectUser> activeMembers = projectUserRepository.findActiveMembers(id);

        // Convert to MemberResponse DTOs
        List<MemberResponse> memberResponses = memberMapper.toResponseList(activeMembers);

        // Calculate role statistics
        long totalMembers = activeMembers.size();
        long leaderCount = projectUserRepository.countByIdProjectIdAndRoleInProject(id, ProjectRole.LEADER);
        long memberCount = projectUserRepository.countByIdProjectIdAndRoleInProject(id, ProjectRole.MEMBER);
        long viewerCount = projectUserRepository.countByIdProjectIdAndRoleInProject(id, ProjectRole.VIEWER);

        ProjectMapper.RoleStatistics statistics = new ProjectMapper.RoleStatistics(
                totalMembers, leaderCount, memberCount, viewerCount);

        // Build detail response
        ProjectDetailResponse response = projectMapper.toDetailResponse(
                project, currentUserRole, memberResponses, statistics);

        log.info("Retrieved project detail for project: {} (ID: {})", project.getName(), id);
        return response;
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
                .orElseThrow(() -> new NotFoundException("Project", projectId));

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
                    .orElseThrow(() -> new NotFoundException("Project", projectId));

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
                    .orElseThrow(() -> new NotFoundException("Project", projectId));

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
                .orElseThrow(() -> new NotFoundException("Project", projectId));

        // Check if project is actually deleted
        if (project.getDeletedAt() == null) {
            throw new BadRequestException("Project is not in trash");
        }

        // Check authorization: only LEADER can restore
        securityService.requireLeader(projectId, currentUserId);

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

        // Get current user
        Long currentUserId = securityService.getCurrentUserId();

        // Find trashed projects
        List<Project> trashedProjects = projectRepository.findTrashedProjectsByLeaderId(currentUserId);

        return trashedProjects.stream()
                .map(p -> {
                    int memberCount = p.getProjectUsers().size();
                    return projectMapper.toResponse(p, ProjectRole.LEADER, (long) memberCount);
                })
                .collect(Collectors.toList());
    }
}
