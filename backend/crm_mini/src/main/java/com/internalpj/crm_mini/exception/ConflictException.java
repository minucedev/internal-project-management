package com.internalpj.crm_mini.exception;

/**
 * Exception thrown when there's a conflict with existing data.
 * Maps to HTTP 409 Conflict.
 * 
 * Examples:
 * - User already exists in project
 * - Duplicate resource creation
 */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }

    /**
     * For duplicate member in project.
     */
    public static ConflictException memberAlreadyExists(String email) {
        return new ConflictException(
                String.format("User with email '%s' is already a member of this project", email));
    }

    /**
     * For duplicate project name (if enforced).
     */
    public static ConflictException duplicateProjectName(String name) {
        return new ConflictException(
                String.format("A project with name '%s' already exists", name));
    }
}
