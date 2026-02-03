package com.internalpj.crm_mini.error.enums;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // === AUTH / USER ===
    USERNAME_ALREADY_EXISTS("USERNAME_ALREADY_EXISTS", "Username already exists"),
    EMAIL_ALREADY_EXISTS("EMAIL_ALREADY_EXISTS", "Email already exists"),
    INVALID_CREDENTIALS("INVALID_CREDENTIALS", "Invalid username or password"),
    USER_NOT_FOUND("USER_NOT_FOUND", "User not found"),
    UNAUTHORIZED("AUTH_001", "Unauthorized"),
    FORBIDDEN("AUTH_002", "Forbidden"),
    ROLE_NOT_FOUND("ROLE_NOT_FOUND", "ID not existed"),
    VALIDATION_ERROR("VALIDATION_ERROR", "Invalid input data"),
    REFRESH_TOKEN_NOT_FOUND("REFRESH_TOKEN_NOT_FOUND", "Refresh token not found"),
    INVALID_TOKEN("INVALID_TOKEN", "Refresh token is invalid or has been tampered with."),

    // === PROJECT MANAGEMENT ===
    PROJECT_NOT_FOUND("PROJECT_NOT_FOUND", "Project not found"),
    PROJECT_FORBIDDEN("PROJECT_FORBIDDEN", "You don't have permission to access this project"),
    MEMBER_NOT_FOUND("MEMBER_NOT_FOUND", "Member not found in project"),
    MEMBER_ALREADY_EXISTS("MEMBER_ALREADY_EXISTS", "User is already a member of this project"),
    CANNOT_REMOVE_LAST_LEADER("CANNOT_REMOVE_LAST_LEADER", "Cannot remove the last leader from project"),
    INVALID_DATE_RANGE("INVALID_DATE_RANGE", "End date must be after start date"),
    MEMBER_LIMIT_EXCEEDED("MEMBER_LIMIT_EXCEEDED", "Project has reached maximum member limit"),

    // === SYSTEM ===
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

}
