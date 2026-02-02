package com.internalpj.crm_mini.exception;

/**
 * Exception thrown when a user attempts to access a resource they don't have
 * permission for.
 * Maps to HTTP 403 Forbidden.
 */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }

    public ForbiddenException() {
        super("You don't have permission to access this resource");
    }

    /**
     * For project access denial.
     */
    public static ForbiddenException projectAccess(Long projectId) {
        return new ForbiddenException(
                String.format("You don't have permission to access project with ID: %d", projectId));
    }

    /**
     * For leader-only operations.
     */
    public static ForbiddenException leaderOnly() {
        return new ForbiddenException("Only project leaders can perform this action");
    }

    /**
     * For member-only operations.
     */
    public static ForbiddenException memberOnly() {
        return new ForbiddenException("You must be a member of this project to perform this action");
    }
}
