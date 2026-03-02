package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

/**
 * Exception thrown when there's a conflict with existing data.
 * Maps to HTTP 409 Conflict.
 * 
 * Examples:
 * - User already exists in project
 * - Duplicate resource creation
 */
public class ConflictException extends BusinessException {

    /**
     * Creates a ConflictException with the specified ErrorCode.
     *
     * @param errorCode the error code (should be a CONFLICT type)
     */
    public ConflictException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * Creates a ConflictException with a custom message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message
     */
    public ConflictException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // ==================== Static Factory Methods ====================

    /**
     * For duplicate member in project.
     *
     * @return ConflictException with MEMBER_ALREADY_EXISTS error code
     */
    public static ConflictException memberAlreadyExists() {
        return new ConflictException(ErrorCode.MEMBER_ALREADY_EXISTS);
    }

    /**
     * For duplicate member in project with email.
     *
     * @param email the user's email
     * @return ConflictException with custom message
     */
    public static ConflictException memberAlreadyExists(String email) {
        return new ConflictException(ErrorCode.MEMBER_ALREADY_EXISTS,
                String.format("User with email '%s' is already a member of this project", email));
    }

    /**
     * For pending invitation already exists.
     *
     * @return ConflictException with PENDING_INVITATION_EXISTS error code
     */
    public static ConflictException pendingInvitationExists() {
        return new ConflictException(ErrorCode.PENDING_INVITATION_EXISTS);
    }

    /**
     * For duplicate project name (if enforced).
     *
     * @param name the project name
     * @return ConflictException with custom message
     */
    public static ConflictException duplicateProjectName(String name) {
        return new ConflictException(ErrorCode.DUPLICATE_PROJECT_NAME,
                String.format("A project with name '%s' already exists", name));
    }
}
