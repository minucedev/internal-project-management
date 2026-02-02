package com.internalpj.crm_mini.entity.enums;

/**
 * Enum representing the status of a user's membership in a project.
 * Maps to database ENUM type: project_user_status
 */
public enum ProjectUserStatus {
    /**
     * Active status - user is currently a member of the project
     */
    ACTIVE("active"),

    /**
     * Inactive status - user has been removed or left the project
     * Used for soft delete to maintain history
     */
    INACTIVE("inactive"),

    /**
     * Pending status - user has been invited but hasn't accepted yet
     * Used for invitation workflow
     */
    PENDING("pending"),

    /**
     * Removed status - user has been permanently removed from the project
     * Different from inactive, indicates a harder removal
     */
    REMOVED("removed");

    private final String value;

    ProjectUserStatus(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Convert database string value to enum
     */
    public static ProjectUserStatus fromValue(String value) {
        for (ProjectUserStatus status : ProjectUserStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Invalid ProjectUserStatus value: " + value);
    }
}
