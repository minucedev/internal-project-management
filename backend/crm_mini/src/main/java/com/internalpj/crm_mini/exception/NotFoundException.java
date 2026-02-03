package com.internalpj.crm_mini.exception;

/**
 * Exception thrown when a requested resource is not found.
 * Maps to HTTP 404 Not Found.
 */
public class NotFoundException extends RuntimeException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException(String resourceType, Long id) {
        super(String.format("%s not found with ID: %d", resourceType, id));
    }

    public NotFoundException(String resourceType, String identifier) {
        super(String.format("%s not found: %s", resourceType, identifier));
    }
}
