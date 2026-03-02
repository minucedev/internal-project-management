package com.internalpj.crm_mini.error;

import com.internalpj.crm_mini.error.enums.ErrorCode;
import org.springframework.http.HttpStatus;

/**
 * Base exception class for all business logic exceptions.
 * Provides centralized error code management and HTTP status mapping.
 */
public class BusinessException extends RuntimeException {
    private final ErrorCode errorCode;

    /**
     * Creates a BusinessException with the default message from ErrorCode.
     *
     * @param errorCode the error code
     */
    public BusinessException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    /**
     * Creates a BusinessException with a custom message.
     * Use this when you need to override the default error message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message (if null, uses default from
     *                      ErrorCode)
     */
    public BusinessException(ErrorCode errorCode, String customMessage) {
        super(customMessage != null ? customMessage : errorCode.getMessage());
        this.errorCode = errorCode;
    }

    /**
     * Creates a BusinessException with dynamic parameters for message formatting.
     * The ErrorCode message should contain format specifiers (e.g., %s, %d).
     *
     * Example:
     * 
     * <pre>
     * // If ErrorCode.PROJECT_NOT_FOUND has message "Project not found with ID:
     * // %d"
     * throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND, 123L);
     * // Results in: "Project not found with ID: 123"
     * </pre>
     *
     * @param errorCode the error code
     * @param params    parameters to format into the error message
     */
    public BusinessException(ErrorCode errorCode, Object... params) {
        super(formatMessage(errorCode.getMessage(), params));
        this.errorCode = errorCode;
    }

    /**
     * Gets the error code associated with this exception.
     *
     * @return the error code
     */
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    /**
     * Gets the HTTP status code associated with this exception.
     *
     * @return the HTTP status from the error code
     */
    public HttpStatus getHttpStatus() {
        return errorCode.getHttpStatus();
    }

    /**
     * Formats a message with parameters, handling null/empty params gracefully.
     *
     * @param message the message template
     * @param params  the parameters to format
     * @return formatted message or original message if params are empty
     */
    private static String formatMessage(String message, Object... params) {
        if (params == null || params.length == 0) {
            return message;
        }
        try {
            return String.format(message, params);
        } catch (Exception e) {
            // If formatting fails, return original message
            return message;
        }
    }
}
