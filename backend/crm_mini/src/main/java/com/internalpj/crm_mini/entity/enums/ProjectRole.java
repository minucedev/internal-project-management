package com.internalpj.crm_mini.entity.enums;

/**
 * Enum representing the role of a user within a project.
 * Maps to database ENUM type: project_role
 */
public enum ProjectRole {
    /**
     * Leader role - has full control over the project
     * Can add/remove members, update/delete project
     */
    LEADER("leader"),

    /**
     * Member role - can view and participate in the project
     * Cannot modify project settings or manage members
     */
    MEMBER("member"),

    /**
     * Viewer role - read-only access to the project
     * Can only view project information, cannot participate or modify
     */
    VIEWER("viewer");

    private final String value;

    ProjectRole(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    /**
     * Convert database string value to enum
     */
    public static ProjectRole fromValue(String value) {
        for (ProjectRole role : ProjectRole.values()) {
            if (role.value.equalsIgnoreCase(value)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Invalid ProjectRole value: " + value);
    }
}
