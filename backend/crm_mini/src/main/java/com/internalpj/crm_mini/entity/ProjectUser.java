package com.internalpj.crm_mini.entity;

import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.entity.enums.ProjectUserStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity representing the relationship between a User and a Project.
 * Maps to database table: project_users
 * Uses composite primary key (project_id, user_id).
 */
@Getter
@Setter
@ToString(exclude = { "project", "user" })
@EqualsAndHashCode(exclude = { "project", "user" })
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "project_users")
public class ProjectUser {

    /**
     * Composite primary key consisting of projectId and userId.
     */
    @EmbeddedId
    private ProjectUserId id;

    /**
     * Reference to the Project entity.
     * Part of the composite key relationship.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("projectId")
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    /**
     * Reference to the User entity.
     * Part of the composite key relationship.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Role of the user in this project (LEADER or MEMBER).
     * Maps to database ENUM: project_role
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "role_in_project", nullable = false, columnDefinition = "VARCHAR(20)")
    @Builder.Default
    private ProjectRole roleInProject = ProjectRole.MEMBER;

    /**
     * Optional position/title of the user in the project.
     * E.g., "Backend Developer", "Project Manager", etc.
     */
    @Size(max = 100, message = "Position title must not exceed 100 characters")
    @Column(name = "position_title", length = 100)
    private String positionTitle;

    /**
     * Status of the user's membership (ACTIVE or INACTIVE).
     * Maps to database ENUM: project_user_status
     * INACTIVE is used for soft delete.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status_in_project", nullable = false, columnDefinition = "VARCHAR(20)")
    @Builder.Default
    private ProjectUserStatus statusInProject = ProjectUserStatus.ACTIVE;

    /**
     * Timestamp when the user joined the project.
     */
    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    /**
     * Invite token for pending invitations.
     * UUID-based token, cleared when invitation is accepted.
     */
    @Column(name = "invite_token", length = 64, unique = true)
    private String inviteToken;

    /**
     * Invite expiration timestamp.
     * Default: 7 days from creation.
     */
    @Column(name = "invite_expiry")
    private LocalDateTime inviteExpiry;

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        if (joinedAt == null) {
            joinedAt = LocalDateTime.now();
        }
        if (roleInProject == null) {
            roleInProject = ProjectRole.MEMBER;
        }
        if (statusInProject == null) {
            statusInProject = ProjectUserStatus.ACTIVE;
        }
    }

    // Business methods

    /**
     * Check if the user is a leader of the project.
     */
    public boolean isLeader() {
        return ProjectRole.LEADER.equals(roleInProject);
    }

    /**
     * Check if the user is a member of the project.
     */
    public boolean isMember() {
        return ProjectRole.MEMBER.equals(roleInProject);
    }

    /**
     * Check if the user is a viewer (read-only) of the project.
     */
    public boolean isViewer() {
        return ProjectRole.VIEWER.equals(roleInProject);
    }

    /**
     * Check if the user has write permissions (LEADER or MEMBER).
     */
    public boolean hasWritePermission() {
        return isLeader() || isMember();
    }

    /**
     * Check if the user is an active member of the project.
     */
    public boolean isActive() {
        return ProjectUserStatus.ACTIVE.equals(statusInProject);
    }

    /**
     * Check if the user's invitation is pending.
     */
    public boolean isPending() {
        return ProjectUserStatus.PENDING.equals(statusInProject);
    }

    /**
     * Check if the user has been removed from the project.
     */
    public boolean isRemoved() {
        return ProjectUserStatus.REMOVED.equals(statusInProject);
    }

    /**
     * Check if the user is inactive.
     */
    public boolean isInactive() {
        return ProjectUserStatus.INACTIVE.equals(statusInProject);
    }

    /**
     * Deactivate the user's membership (soft delete).
     */
    public void deactivate() {
        this.statusInProject = ProjectUserStatus.INACTIVE;
    }

    /**
     * Mark the user as removed (harder removal than inactive).
     */
    public void markAsRemoved() {
        this.statusInProject = ProjectUserStatus.REMOVED;
    }

    /**
     * Mark the user as pending (waiting for acceptance).
     */
    public void markAsPending() {
        this.statusInProject = ProjectUserStatus.PENDING;
    }

    /**
     * Accept invitation and activate membership.
     */
    public void acceptInvitation() {
        if (isPending()) {
            this.statusInProject = ProjectUserStatus.ACTIVE;
            this.joinedAt = LocalDateTime.now();
        }
    }

    /**
     * Reactivate the user's membership.
     * Updates joinedAt to current time.
     */
    public void reactivate() {
        this.statusInProject = ProjectUserStatus.ACTIVE;
        this.joinedAt = LocalDateTime.now();
    }

    /**
     * Check if the invite has expired.
     * 
     * @return true if invite expiry is in the past
     */
    public boolean isInviteExpired() {
        return inviteExpiry != null && LocalDateTime.now().isAfter(inviteExpiry);
    }

    /**
     * Check if the invite is valid.
     * Valid means: has token, not expired, and status is PENDING.
     * 
     * @return true if invite is valid
     */
    public boolean isInviteValid() {
        return inviteToken != null &&
                !isInviteExpired() &&
                statusInProject == ProjectUserStatus.PENDING;
    }

    /**
     * Promote member to leader.
     */
    public void promoteToLeader() {
        this.roleInProject = ProjectRole.LEADER;
    }

    /**
     * Demote leader to member.
     */
    public void demoteToMember() {
        this.roleInProject = ProjectRole.MEMBER;
    }
}
