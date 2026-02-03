package com.internalpj.crm_mini.exception;

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
public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }

    /**
     * For last leader removal attempt.
     */
    public static BadRequestException cannotRemoveLastLeader() {
        return new BadRequestException(
                "Cannot leave project. You are the only leader. Please transfer leadership or delete the project.");
    }

    /**
     * For invalid date range.
     */
    public static BadRequestException invalidDateRange() {
        return new BadRequestException(
                "End date must be after start date");
    }

    /**
     * For invalid status transition.
     */
    public static BadRequestException invalidStatusTransition(String from, String to) {
        return new BadRequestException(
                String.format("Cannot transition from status '%s' to '%s'", from, to));
    }

    /**
     * For exceeding member limit.
     */
    public static BadRequestException memberLimitExceeded(int limit) {
        return new BadRequestException(
                String.format("Project has reached maximum member limit of %d", limit));
    }
}
