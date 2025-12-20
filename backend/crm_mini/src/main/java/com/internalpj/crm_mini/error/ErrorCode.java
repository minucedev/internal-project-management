package com.internalpj.crm_mini.error;

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
    VALIDATION_ERROR("VALIDATION_ERROR", "Invalid input data"), 


    // === SYSTEM ===
    INTERNAL_ERROR("INTERNAL_ERROR", "Internal server error");

    private final String code;
    private final String message;

    ErrorCode(String code, String message) {
        this.code = code;
        this.message = message;
    }

}
