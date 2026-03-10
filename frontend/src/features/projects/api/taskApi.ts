import type {
    Task, CreateTaskRequest, UpdateTaskMetadataRequest,
    ChangeStatusRequest, AssignTaskRequest,
} from '../types/task.types';

// ─── Mock data (Sprint 1 — sẽ thay bằng axios khi backend ready) ────────────

const MOCK_TASKS: Task[] = [
    {
        id: 1, projectId: 101, title: 'Thiết kế database schema',
        description: 'Tạo toàn bộ bảng và quan hệ cho module Task, bao gồm migration script',
        status: 'DONE', priority: 'HIGH',
        assigneeId: 2,
        assignee: { id: 2, username: 'tran_member', email: 'member@project.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-03-10T17:00:00Z', completedAt: '2026-03-09T14:30:00Z',
        createdAt: '2026-03-01T08:00:00Z', updatedAt: '2026-03-09T14:30:00Z',
    },
    {
        id: 2, projectId: 101, title: 'Xây dựng API tạo task',
        description: 'Endpoint POST /tasks, validate đầu vào, kiểm tra role Leader/Member',
        status: 'IN_PROGRESS', priority: 'HIGH',
        assigneeId: 2,
        assignee: { id: 2, username: 'tran_member', email: 'member@project.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-03-15T17:00:00Z', completedAt: null,
        createdAt: '2026-03-05T09:00:00Z', updatedAt: '2026-03-05T09:00:00Z',
    },
    {
        id: 3, projectId: 101, title: 'Xây dựng Kanban Board UI',
        description: 'Dựng layout 5 cột, hiển thị task card theo từng trạng thái',
        status: 'IN_REVIEW', priority: 'HIGH',
        assigneeId: 2,
        assignee: { id: 2, username: 'tran_member', email: 'member@project.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-03-14T17:00:00Z', completedAt: null,
        createdAt: '2026-03-05T09:30:00Z', updatedAt: '2026-03-06T10:00:00Z',
    },
    {
        id: 4, projectId: 101, title: 'Viết middleware kiểm tra role',
        description: 'Đọc role từ bảng project_members, gắn vào request context',
        status: 'TODO', priority: 'MEDIUM',
        assigneeId: null, assignee: null,
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-03-16T17:00:00Z', completedAt: null,
        createdAt: '2026-03-06T10:00:00Z', updatedAt: '2026-03-06T10:00:00Z',
    },
    {
        id: 5, projectId: 101, title: 'Thiết kế modal chi tiết task',
        description: 'Hiển thị đầy đủ thông tin, ẩn/hiện nút theo role người dùng',
        status: 'TODO', priority: 'MEDIUM',
        assigneeId: null, assignee: null,
        createdBy: { id: 2, username: 'tran_member', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
        deadline: '2026-03-17T17:00:00Z', completedAt: null,
        createdAt: '2026-03-06T11:00:00Z', updatedAt: '2026-03-06T11:00:00Z',
    },
    {
        id: 6, projectId: 101, title: 'Tích hợp API assign task',
        description: 'Kết nối frontend với endpoint PATCH /assign, xử lý self-assign cho Member',
        status: 'CANCELLED', priority: 'LOW',
        assigneeId: null, assignee: null,
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-03-20T17:00:00Z', completedAt: null,
        createdAt: '2026-03-06T12:00:00Z', updatedAt: '2026-03-07T08:00:00Z',
    },
    {
        id: 7, projectId: 101, title: 'Task quá hạn chưa xử lý',
        description: 'Task này dùng để test deadline overdue UI — deadline đã qua',
        status: 'TODO', priority: 'HIGH',
        assigneeId: 2,
        assignee: { id: 2, username: 'tran_member', email: 'member@project.com', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member' },
        createdBy: { id: 1, username: 'nguyen_leader', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=leader' },
        deadline: '2026-02-28T17:00:00Z', completedAt: null,
        createdAt: '2026-02-20T08:00:00Z', updatedAt: '2026-02-20T08:00:00Z',
    },
];

// In-memory store — mutations update this array
let mockStore: Task[] = [...MOCK_TASKS];
let nextId = MOCK_TASKS.length + 1;

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

// ─── API functions (map 1:1 with 7 backend endpoints) ─────────────────────────

/** 1. GET /projects/{projectId}/tasks — all roles */
export async function getTasks(projectId: string): Promise<Task[]> {
    await delay();
    return mockStore.filter((t) => t.projectId === Number(projectId));
}

/** 2. GET /projects/{projectId}/tasks/{taskId} — all roles */
export async function getTaskDetail(projectId: string, taskId: number): Promise<Task> {
    await delay();
    const task = mockStore.find((t) => t.id === taskId && t.projectId === Number(projectId));
    if (!task) throw new Error('Task not found');
    return task;
}

/** 3. POST /projects/{projectId}/tasks — Leader & Member */
export async function createTask(projectId: string, data: CreateTaskRequest): Promise<Task> {
    await delay();
    const newTask: Task = {
        id: nextId++,
        projectId: Number(projectId),
        title: data.title,
        description: data.description,
        status: 'TODO',
        priority: data.priority,
        assigneeId: data.assigneeId ?? null,
        assignee: null, // simplified — real API returns full object
        createdBy: { id: 1, username: 'current_user' },
        deadline: data.deadline,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    mockStore = [...mockStore, newTask];
    return newTask;
}

/** 4. PATCH /projects/{projectId}/tasks/{taskId} — Leader only */
export async function updateTaskMetadata(
    projectId: string, taskId: number, data: UpdateTaskMetadataRequest
): Promise<Task> {
    await delay();
    mockStore = mockStore.map((t) =>
        t.id === taskId && t.projectId === Number(projectId)
            ? { ...t, ...data, updatedAt: new Date().toISOString() }
            : t
    );
    return mockStore.find((t) => t.id === taskId)!;
}

/** 5. PATCH /projects/{projectId}/tasks/{taskId}/status — Leader & Member */
export async function changeTaskStatus(
    projectId: string, taskId: number, data: ChangeStatusRequest
): Promise<Task> {
    await delay();
    mockStore = mockStore.map((t) =>
        t.id === taskId && t.projectId === Number(projectId)
            ? {
                ...t,
                status: data.status,
                completedAt: data.status === 'DONE' ? new Date().toISOString() : t.completedAt,
                updatedAt: new Date().toISOString(),
            }
            : t
    );
    return mockStore.find((t) => t.id === taskId)!;
}

/** 6. PATCH /projects/{projectId}/tasks/{taskId}/assign — Leader & Member */
export async function assignTask(
    projectId: string, taskId: number, data: AssignTaskRequest
): Promise<Task> {
    await delay();
    mockStore = mockStore.map((t) =>
        t.id === taskId && t.projectId === Number(projectId)
            ? { ...t, assigneeId: data.assigneeId, assignee: null, updatedAt: new Date().toISOString() }
            : t
    );
    return mockStore.find((t) => t.id === taskId)!;
}

/** 7. DELETE /projects/{projectId}/tasks/{taskId} — Leader only, TODO only */
export async function deleteTask(projectId: string, taskId: number): Promise<void> {
    await delay();
    const task = mockStore.find((t) => t.id === taskId && t.projectId === Number(projectId));
    if (task && task.status !== 'TODO') {
        throw new Error('Chỉ có thể xóa task đang ở trạng thái Cần làm');
    }
    mockStore = mockStore.filter((t) => !(t.id === taskId && t.projectId === Number(projectId)));
}
