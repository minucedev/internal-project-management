package com.internalpj.crm_mini.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity representing a Project in the system.
 * Maps to database table: projects
 */
@Getter
@Setter
@ToString(exclude = { "createdBy", "projectUsers" })
@EqualsAndHashCode(exclude = { "createdBy", "projectUsers" })
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Project name is required")
    @Size(min = 3, max = 200, message = "Project name must be between 3 and 200 characters")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    /**
     * The user who created this project.
     * This user is automatically assigned as LEADER in project_users table.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Soft delete timestamp.
     * When not null, the project is considered deleted.
     */
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    /**
     * Project members and their roles.
     * Bidirectional relationship with ProjectUser.
     */
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ProjectUser> projectUsers = new ArrayList<>();

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Business methods

    /**
     * Soft delete the project.
     * Sets deletedAt timestamp and marks all project members as inactive.
     */
    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
        // Mark all project users as inactive
        if (projectUsers != null) {
            projectUsers.forEach(ProjectUser::deactivate);
        }
    }

    /**
     * Check if the project is deleted (soft delete).
     */
    public boolean isDeleted() {
        return deletedAt != null;
    }

    /**
     * Restore the project from trash.
     * Clears deletedAt timestamp and reactivates all project members.
     */
    public void restore() {
        this.deletedAt = null;
        // Reactivate all project users
        if (projectUsers != null) {
            projectUsers.forEach(ProjectUser::reactivate);
        }
    }

    /**
     * Add a member to the project.
     * Helper method to maintain bidirectional relationship.
     */
    public void addProjectUser(ProjectUser projectUser) {
        projectUsers.add(projectUser);
        projectUser.setProject(this);
    }

    /**
     * Remove a member from the project.
     * Helper method to maintain bidirectional relationship.
     */
    public void removeProjectUser(ProjectUser projectUser) {
        projectUsers.remove(projectUser);
        projectUser.setProject(null);
    }
}
