package com.internalpj.crm_mini.controller.auth.enums;

import lombok.Getter;

@Getter
public enum RoleType {
    USER(1, "ROLE_USER"),
    ADMIN(2, "ROLE_ADMIN");

    private final int id;
    private final String role;

    RoleType(int id, String role) {
        this.id = id;
        this.role = role;

    }

    public static RoleType fromId(int id) {
        for (RoleType type : values()) {
            if (type.id == id)
                return type;

        }

        return USER;
    }

}
