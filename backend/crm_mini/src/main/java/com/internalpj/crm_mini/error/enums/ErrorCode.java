package com.internalpj.crm_mini.error.enums;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Centralized error codes for the application.
 * Each error code includes a code string, message, and HTTP status mapping.
 */
@Getter
public enum ErrorCode {

    // ==================== AUTHENTICATION & USER (401) ====================
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid username or password", HttpStatus.UNAUTHORIZED),
    REFRESH_TOKEN_NOT_FOUND("REFRESH_TOKEN_NOT_FOUND", "Refresh token not found", HttpStatus.UNAUTHORIZED),
    INVALID_TOKEN("INVALID_TOKEN", "Refresh token is invalid or has been tampered with", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("TOKEN_EXPIRED", "Refresh token has expired", HttpStatus.UNAUTHORIZED),
    TOKEN_REVOKED("TOKEN_REVOKED", "Refresh token has been revoked", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED("UNAUTHORIZED", "Authentication is required to access this resource", HttpStatus.UNAUTHORIZED),

    // ==================== AUTHORIZATION (403) ====================
    FORBIDDEN("FORBIDDEN", "You don't have permission to access this resource", HttpStatus.FORBIDDEN),
    PROJECT_FORBIDDEN("PROJECT_FORBIDDEN", "You don't have permission to access this project", HttpStatus.FORBIDDEN),
    NOT_PROJECT_MEMBER("NOT_PROJECT_MEMBER", "You are not a member of this project", HttpStatus.FORBIDDEN),
    NOT_AUTHENTICATED("NOT_AUTHENTICATED", "User is not authenticated", HttpStatus.FORBIDDEN),
    INVALID_USER_AUTHENTICATION("INVALID_USER_AUTHENTICATION", "Invalid user authentication", HttpStatus.FORBIDDEN),
    LEADER_ONLY_ACTION("LEADER_ONLY_ACTION", "Only project leaders can perform this action", HttpStatus.FORBIDDEN),
    MEMBER_ONLY_ACTION("MEMBER_ONLY_ACTION", "You must be a member of this project to perform this action",
            HttpStatus.FORBIDDEN),
    INVITATION_FORBIDDEN("INVITATION_FORBIDDEN", "This invitation is for a different user", HttpStatus.FORBIDDEN),

    // ==================== NOT FOUND (404) ====================
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found", HttpStatus.NOT_FOUND),
    PROJECT_NOT_FOUND("PROJECT_NOT_FOUND", "Project not found", HttpStatus.NOT_FOUND),
    MEMBER_NOT_FOUND("MEMBER_NOT_FOUND", "Member not found in project", HttpStatus.NOT_FOUND),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "Role not found", HttpStatus.NOT_FOUND),
    INVITATION_NOT_FOUND("INVITATION_NOT_FOUND", "Invitation not found", HttpStatus.NOT_FOUND),
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Requested resource not found", HttpStatus.NOT_FOUND),

    // ==================== CONFLICT (409) ====================
    USERNAME_ALREADY_EXISTS("USERNAME_ALREADY_EXISTS", "Username already exists", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS", "Email already exists", HttpStatus.CONFLICT),
    MEMBER_ALREADY_EXISTS("MEMBER_ALREADY_EXISTS", "User is already an active member of this project",
            HttpStatus.CONFLICT),
    PENDING_INVITATION_EXISTS("PENDING_INVITATION_EXISTS", "User already has a pending invitation",
            HttpStatus.CONFLICT),
    DUPLICATE_PROJECT_NAME("DUPLICATE_PROJECT_NAME", "A project with this name already exists", HttpStatus.CONFLICT),

    // ==================== BAD REQUEST & VALIDATION (400) ====================
    BAD_REQUEST("BAD_REQUEST", "Invalid request", HttpStatus.BAD_REQUEST),
    VALIDATION_ERROR("VALIDATION_ERROR", "Invalid input data", HttpStatus.BAD_REQUEST),
    INVALID_ROLE("INVALID_ROLE", "Invalid role specified", HttpStatus.BAD_REQUEST),
    INVALID_DATE_RANGE("INVALID_DATE_RANGE", "End date must be after start date", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_TRANSITION("INVALID_STATUS_TRANSITION", "Invalid status transition", HttpStatus.BAD_REQUEST),

    // ==================== BUSINESS RULES (400) ====================
    CANNOT_REMOVE_LAST_LEADER("CANNOT_REMOVE_LAST_LEADER", "Cannot remove the last leader from project",
            HttpStatus.BAD_REQUEST),
    MEMBER_LIMIT_EXCEEDED("MEMBER_LIMIT_EXCEEDED", "Project has reached maximum member limit", HttpStatus.BAD_REQUEST),
    PROJECT_NOT_IN_TRASH("PROJECT_NOT_IN_TRASH", "Project is not in trash", HttpStatus.BAD_REQUEST),

    // ==================== INVITATION ERRORS (400) ====================
    INVITATION_EXPIRED("INVITATION_EXPIRED", "Invitation has expired", HttpStatus.BAD_REQUEST),
    INVITATION_NOT_PENDING("INVITATION_NOT_PENDING", "Invitation is not pending", HttpStatus.BAD_REQUEST),

    // ==================== SYSTEM ERRORS (500) ====================
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

}
