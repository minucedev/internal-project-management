package com.internalpj.crm_mini.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for ProjectUser entity.
 * Represents the combination of (project_id, user_id).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class ProjectUserId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "user_id")
    private Long userId;

    /**
     * Override equals for composite key comparison.
     * Required for JPA to properly identify entities.
     */
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        ProjectUserId that = (ProjectUserId) o;
        return Objects.equals(projectId, that.projectId) &&
                Objects.equals(userId, that.userId);
    }

    /**
     * Override hashCode for composite key.
     * Required for JPA to properly identify entities.
     */
    @Override
    public int hashCode() {
        return Objects.hash(projectId, userId);
    }
}
