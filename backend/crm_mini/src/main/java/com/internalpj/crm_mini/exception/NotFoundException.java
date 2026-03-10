package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

/**
 * Exception thrown when a requested resource is not found.
 * Maps to HTTP 404 Not Found.
 */
public class NotFoundException extends BusinessException {

    /**
     * Creates a NotFoundException with the specified ErrorCode.
     *
     * @param errorCode the error code (should be a NOT_FOUND type)
     */
    public NotFoundException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * Creates a NotFoundException with a custom message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message
     */
    public NotFoundException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // ==================== Static Factory Methods ====================

    /**
     * Creates a NotFoundException for a project.
     *
     * @return NotFoundException with PROJECT_NOT_FOUND error code
     */
    public static NotFoundException project() {
        return new NotFoundException(ErrorCode.PROJECT_NOT_FOUND);
    }

    /**
     * Creates a NotFoundException for a project with custom ID message.
     *
     * @param projectId the project ID
     * @return NotFoundException with custom message
     */
    public static NotFoundException project(Long projectId) {
        return new NotFoundException(ErrorCode.PROJECT_NOT_FOUND,
                String.format("Project not found with ID: %d", projectId));
    }

    /**
     * Creates a NotFoundException for a member.
     *
     * @return NotFoundException with MEMBER_NOT_FOUND error code
     */
    public static NotFoundException member() {
        return new NotFoundException(ErrorCode.MEMBER_NOT_FOUND);
    }

    /**
     * Creates a NotFoundException for a member with custom message.
     *
     * @param userId    the user ID
     * @param projectId the project ID
     * @return NotFoundException with custom message
     */
    public static NotFoundException member(Long userId, Long projectId) {
        return new NotFoundException(ErrorCode.MEMBER_NOT_FOUND,
                String.format("Member with user ID %d not found in project %d", userId, projectId));
    }

    /**
     * Creates a NotFoundException for an invitation.
     *
     * @return NotFoundException with INVITATION_NOT_FOUND error code
     */
    public static NotFoundException invitation() {
        return new NotFoundException(ErrorCode.INVITATION_NOT_FOUND);
    }

    /**
     * Creates a NotFoundException for a user.
     *
     * @return NotFoundException with USER_NOT_FOUND error code
     */
    public static NotFoundException user() {
        return new NotFoundException(ErrorCode.USER_NOT_FOUND);
    }

    /**
     * Creates a NotFoundException for a generic resource.
     *
     * @param resourceType the type of resource
     * @param identifier   the resource identifier
     * @return NotFoundException with custom message
     */
    public static NotFoundException task(Long taskId) {
        return new NotFoundException(ErrorCode.TASK_NOT_FOUND,
                String.format("Task not found with ID: %d", taskId));
    }

    public static NotFoundException resource(String resourceType, String identifier) {
        return new NotFoundException(ErrorCode.RESOURCE_NOT_FOUND,
                String.format("%s not found: %s", resourceType, identifier));
    }
}
