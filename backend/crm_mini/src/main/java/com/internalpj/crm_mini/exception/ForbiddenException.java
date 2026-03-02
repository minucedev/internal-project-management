package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

/**
 * Exception thrown when a user attempts to access a resource they don't have
 * permission for.
 * Maps to HTTP 403 Forbidden.
 */
public class ForbiddenException extends BusinessException {

    /**
     * Creates a ForbiddenException with the specified ErrorCode.
     *
     * @param errorCode the error code (should be a FORBIDDEN type)
     */
    public ForbiddenException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * Creates a ForbiddenException with a custom message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message
     */
    public ForbiddenException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // ==================== Static Factory Methods ====================

    /**
     * For generic forbidden access.
     *
     * @return ForbiddenException with FORBIDDEN error code
     */
    public static ForbiddenException forbidden() {
        return new ForbiddenException(ErrorCode.FORBIDDEN);
    }

    /**
     * For project access denial.
     *
     * @return ForbiddenException with PROJECT_FORBIDDEN error code
     */
    public static ForbiddenException projectAccess() {
        return new ForbiddenException(ErrorCode.PROJECT_FORBIDDEN);
    }

    /**
     * For project access denial with specific project ID.
     *
     * @param projectId the project ID
     * @return ForbiddenException with custom message
     */
    public static ForbiddenException projectAccess(Long projectId) {
        return new ForbiddenException(ErrorCode.PROJECT_FORBIDDEN,
                String.format("You don't have permission to access project with ID: %d", projectId));
    }

    /**
     * For leader-only operations.
     *
     * @return ForbiddenException with LEADER_ONLY_ACTION error code
     */
    public static ForbiddenException leaderOnly() {
        return new ForbiddenException(ErrorCode.LEADER_ONLY_ACTION);
    }

    /**
     * For member-only operations.
     *
     * @return ForbiddenException with MEMBER_ONLY_ACTION error code
     */
    public static ForbiddenException memberOnly() {
        return new ForbiddenException(ErrorCode.MEMBER_ONLY_ACTION);
    }

    /**
     * For not being a project member.
     *
     * @return ForbiddenException with NOT_PROJECT_MEMBER error code
     */
    public static ForbiddenException notProjectMember() {
        return new ForbiddenException(ErrorCode.NOT_PROJECT_MEMBER);
    }

    /**
     * For user not authenticated.
     *
     * @return ForbiddenException with NOT_AUTHENTICATED error code
     */
    public static ForbiddenException notAuthenticated() {
        return new ForbiddenException(ErrorCode.NOT_AUTHENTICATED);
    }

    /**
     * For invalid user authentication.
     *
     * @return ForbiddenException with INVALID_USER_AUTHENTICATION error code
     */
    public static ForbiddenException invalidUserAuthentication() {
        return new ForbiddenException(ErrorCode.INVALID_USER_AUTHENTICATION);
    }

    /**
     * For invitation forbidden (wrong user).
     *
     * @return ForbiddenException with INVITATION_FORBIDDEN error code
     */
    public static ForbiddenException invitationForbidden() {
        return new ForbiddenException(ErrorCode.INVITATION_FORBIDDEN);
    }
}
