package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.dto.request.TaskCreateRequest;
import com.internalpj.crm_mini.dto.request.TaskStatusUpdateRequest;
import com.internalpj.crm_mini.dto.request.TaskUpdateRequest;
import com.internalpj.crm_mini.dto.response.TaskListResponse;
import com.internalpj.crm_mini.dto.response.TaskResponse;
import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.Task;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.TaskStatus;
import com.internalpj.crm_mini.exception.ForbiddenException;
import com.internalpj.crm_mini.exception.NotFoundException;
import com.internalpj.crm_mini.mapper.TaskMapper;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.TaskRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TaskMapper taskMapper;

    // ── CREATE ───────────────────────────────────────────────────────────────

    /**
     * Create a new task in the project.
     * <ul>
     * <li>LEADER may set assigneeId (must be an active member).</li>
     * <li>MEMBER creates task with assigneeId = NULL (plan rule).</li>
     * </ul>
     */
    @Transactional
    public TaskResponse createTask(Long projectId,
            TaskCreateRequest request,
            Long userId,
            ProjectRole callerRole) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> NotFoundException.project(projectId));

        User creator = userRepository.findById(userId)
                .orElseThrow(NotFoundException::user);

        User assignee = null;
        if (callerRole == ProjectRole.LEADER && request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> NotFoundException.resource("User",
                            String.valueOf(request.getAssigneeId())));
        }
        // MEMBER rule: assigneeId is always NULL (ignore even if client sends it)

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null
                        ? request.getPriority()
                        : com.internalpj.crm_mini.entity.enums.TaskPriority.MEDIUM)
                .project(project)
                .assignee(assignee)
                .createdBy(creator)
                .dueDate(request.getDueDate())
                .build();

        return taskMapper.toResponse(taskRepository.save(task));
    }

    // ── LIST ─────────────────────────────────────────────────────────────────

    /**
     * Return a paginated list of tasks with per-project statistics.
     */
    @Transactional(readOnly = true)
    public TaskListResponse getTasks(Long projectId, int page, int size) {
        PageRequest pageable = PageRequest.of(page, size);
        Page<Task> taskPage = taskRepository.findByProjectIdWithUsersPaged(projectId, pageable);

        List<TaskResponse> responses = taskPage.getContent()
                .stream()
                .map(taskMapper::toResponse)
                .toList();

        TaskListResponse.TaskStatistics stats = buildStatistics(projectId);

        TaskListResponse.PaginationInfo pagination = TaskListResponse.PaginationInfo.builder()
                .page(page)
                .size(size)
                .totalElements(taskPage.getTotalElements())
                .totalPages(taskPage.getTotalPages())
                .build();

        return TaskListResponse.builder()
                .tasks(responses)
                .statistics(stats)
                .pagination(pagination)
                .build();
    }

    // ── DETAIL ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TaskResponse getTaskById(Long projectId, Long taskId) {
        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> NotFoundException.task(taskId));
        return taskMapper.toResponse(task);
    }

    // ── STATUS UPDATE ────────────────────────────────────────────────────────

    /**
     * Any active member (LEADER, MEMBER, VIEWER) may update the task status.
     */
    @Transactional
    public TaskResponse updateTaskStatus(Long projectId,
            Long taskId,
            TaskStatusUpdateRequest request) {
        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> NotFoundException.task(taskId));

        task.setStatus(request.getStatus());
        return taskMapper.toResponse(taskRepository.save(task));
    }

    // ── FULL UPDATE ──────────────────────────────────────────────────────────

    /**
     * Full task update — LEADER only.
     * Any non-null field in the request overwrites the existing value.
     * To unassign, send {@code assigneeId: null} explicitly (handled as optional
     * clear).
     */
    @Transactional
    public TaskResponse updateTask(Long projectId,
            Long taskId,
            TaskUpdateRequest request,
            ProjectRole callerRole) {
        if (callerRole != ProjectRole.LEADER) {
            throw ForbiddenException.leaderOnly();
        }

        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> NotFoundException.task(taskId));

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }
        if (request.getDueDate() != null) {
            task.setDueDate(request.getDueDate());
        }

        // Assignee: if the request body explicitly includes assigneeId key,
        // update it (null means "unassign").
        // We always apply this field when it's present in the request.
        resolveAssignee(request, task);

        return taskMapper.toResponse(taskRepository.save(task));
    }

    // ── DELETE ───────────────────────────────────────────────────────────────

    /**
     * Hard delete — LEADER only.
     */
    @Transactional
    public void deleteTask(Long projectId, Long taskId, ProjectRole callerRole) {
        if (callerRole != ProjectRole.LEADER) {
            throw ForbiddenException.leaderOnly();
        }
        Task task = taskRepository.findByIdAndProjectId(taskId, projectId)
                .orElseThrow(() -> NotFoundException.task(taskId));

        taskRepository.delete(task);
    }

    // ── private helpers ──────────────────────────────────────────────────────

    private TaskListResponse.TaskStatistics buildStatistics(Long projectId) {
        List<Object[]> rows = taskRepository.countByStatusForProject(projectId);

        Map<TaskStatus, Long> counts = new EnumMap<>(TaskStatus.class);
        for (Object[] row : rows) {
            counts.put((TaskStatus) row[0], (Long) row[1]);
        }

        long todo = counts.getOrDefault(TaskStatus.TODO, 0L);
        long inProgress = counts.getOrDefault(TaskStatus.IN_PROGRESS, 0L);
        long done = counts.getOrDefault(TaskStatus.DONE, 0L);
        long cancelled = counts.getOrDefault(TaskStatus.CANCELLED, 0L);

        return TaskListResponse.TaskStatistics.builder()
                .total(todo + inProgress + done + cancelled)
                .todo(todo)
                .inProgress(inProgress)
                .done(done)
                .cancelled(cancelled)
                .build();
    }

    private void resolveAssignee(TaskUpdateRequest request, Task task) {
        // The client omits assigneeId → field is null (default POJO value).
        // We only clear/change assignee when the client explicitly sends the field.
        // Since Jackson sets it to null for both "absent" and explicit null,
        // the safest API contract is: always apply whatever the client sends.
        if (request.getAssigneeId() != null) {
            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> NotFoundException.resource("User",
                            String.valueOf(request.getAssigneeId())));
            task.setAssignee(assignee);
        } else {
            task.setAssignee(null);
        }
    }
}
