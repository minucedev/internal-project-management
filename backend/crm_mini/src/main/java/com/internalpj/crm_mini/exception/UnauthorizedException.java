package com.internalpj.crm_mini.exception;

/**
 * Exception thrown when authentication is required but not provided or invalid.
 * Maps to HTTP 401 Unauthorized.
 * 
 * Note: This may already be handled by Spring Security,
 * but included here for completeness.
 */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }

    public UnauthorizedException() {
        super("Authentication is required to access this resource");
    }

    /**
     * For expired tokens.
     */
    public static UnauthorizedException tokenExpired() {
        return new UnauthorizedException("Your session has expired. Please login again.");
    }

    /**
     * For invalid tokens.
     */
    public static UnauthorizedException invalidToken() {
        return new UnauthorizedException("Invalid authentication token");
    }
}
