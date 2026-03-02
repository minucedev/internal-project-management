package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

/**
 * Exception thrown for bad request errors (validation, business rule
 * violations).
 * Maps to HTTP 400 Bad Request.
 * 
 * Examples:
 * - Cannot remove last leader
 * - Invalid date range
 * - Business rule violations
 */
public class BadRequestException extends BusinessException {

    /**
     * Creates a BadRequestException with the specified ErrorCode.
     *
     * @param errorCode the error code (should be a BAD_REQUEST type)
     */
    public BadRequestException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * Creates a BadRequestException with a custom message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message
     */
    public BadRequestException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // ==================== Static Factory Methods ====================

    /**
     * For last leader removal attempt.
     *
     * @return BadRequestException with CANNOT_REMOVE_LAST_LEADER error code
     */
    public static BadRequestException cannotRemoveLastLeader() {
        return new BadRequestException(ErrorCode.CANNOT_REMOVE_LAST_LEADER);
    }

    /**
     * For invalid date range.
     *
     * @return BadRequestException with INVALID_DATE_RANGE error code
     */
    public static BadRequestException invalidDateRange() {
        return new BadRequestException(ErrorCode.INVALID_DATE_RANGE);
    }

    /**
     * For invalid status transition.
     *
     * @param from the current status
     * @param to   the target status
     * @return BadRequestException with custom message
     */
    public static BadRequestException invalidStatusTransition(String from, String to) {
        return new BadRequestException(ErrorCode.INVALID_STATUS_TRANSITION,
                String.format("Cannot transition from status '%s' to '%s'", from, to));
    }

    /**
     * For exceeding member limit.
     *
     * @param limit the member limit
     * @return BadRequestException with custom message
     */
    public static BadRequestException memberLimitExceeded(int limit) {
        return new BadRequestException(ErrorCode.MEMBER_LIMIT_EXCEEDED,
                String.format("Project has reached maximum member limit of %d", limit));
    }

    /**
     * For invalid role.
     *
     * @param role the invalid role
     * @return BadRequestException with custom message
     */
    public static BadRequestException invalidRole(String role) {
        return new BadRequestException(ErrorCode.INVALID_ROLE,
                String.format("Invalid role: %s", role));
    }

    /**
     * For project not in trash.
     *
     * @return BadRequestException with PROJECT_NOT_IN_TRASH error code
     */
    public static BadRequestException projectNotInTrash() {
        return new BadRequestException(ErrorCode.PROJECT_NOT_IN_TRASH);
    }

    /**
     * For invitation expired.
     *
     * @return BadRequestException with INVITATION_EXPIRED error code
     */
    public static BadRequestException invitationExpired() {
        return new BadRequestException(ErrorCode.INVITATION_EXPIRED);
    }

    /**
     * For invitation not pending.
     *
     * @return BadRequestException with INVITATION_NOT_PENDING error code
     */
    public static BadRequestException invitationNotPending() {
        return new BadRequestException(ErrorCode.INVITATION_NOT_PENDING);
    }
}
