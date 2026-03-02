package com.internalpj.crm_mini.mapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.internalpj.crm_mini.dto.response.MemberDetailResponse;
import com.internalpj.crm_mini.dto.response.MemberListResponse;
import com.internalpj.crm_mini.dto.response.MemberResponse;
import com.internalpj.crm_mini.entity.ProjectUser;
import com.internalpj.crm_mini.entity.enums.ProjectRole;

/**
 * MapStruct mapper for converting between ProjectUser entities and Member DTOs.
 * MapStruct will auto-generate the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface MemberMapper {

        /**
         * Convert ProjectUser entity to MemberResponse DTO.
         */
        @Mapping(target = "userId", source = "user.id")
        @Mapping(target = "username", source = "user.username")
        @Mapping(target = "email", source = "user.email")
        @Mapping(target = "phoneNumber", source = "user.phoneNumber")
        @Mapping(target = "roleInProject", source = "roleInProject")
        @Mapping(target = "positionTitle", source = "positionTitle")
        @Mapping(target = "statusInProject", source = "statusInProject")
        @Mapping(target = "joinedAt", source = "joinedAt")
        MemberResponse toResponse(ProjectUser projectUser);

        /**
         * Convert list of ProjectUser entities to list of MemberResponse DTOs.
         */
        List<MemberResponse> toResponseList(List<ProjectUser> projectUsers);

        /**
         * Convert ProjectUser entity to MemberDetailResponse DTO.
         * Includes invite expiry for PENDING invitations.
         */
        @Mapping(target = "userId", source = "user.id")
        @Mapping(target = "username", source = "user.username")
        @Mapping(target = "email", source = "user.email")
        @Mapping(target = "phoneNumber", source = "user.phoneNumber")
        @Mapping(target = "roleInProject", source = "roleInProject")
        @Mapping(target = "positionTitle", source = "positionTitle")
        @Mapping(target = "statusInProject", source = "statusInProject")
        @Mapping(target = "joinedAt", source = "joinedAt")
        @Mapping(target = "inviteExpiry", source = "inviteExpiry")
        @Mapping(target = "avatarUrl", ignore = true) // User entity doesn't have avatarUrl
        MemberDetailResponse toDetailResponse(ProjectUser projectUser);

        /**
         * Convert list of ProjectUser entities to list of MemberDetailResponse DTOs.
         */
        List<MemberDetailResponse> toDetailResponseList(List<ProjectUser> projectUsers);

        /**
         * LEGACY: Convert list of ProjectUser entities to MemberListResponse DTO.
         * This method includes custom logic for calculating statistics.
         * 
         * @deprecated Use repository-level statistics instead for better performance.
         *             This method processes data multiple times in memory.
         */
        @Deprecated
        default MemberListResponse toListResponse(List<ProjectUser> projectUsers) {
                List<MemberResponse> members = toResponseList(projectUsers);

                // Calculate statistics by role (active only)
                Map<ProjectRole, Long> roleCounts = projectUsers.stream()
                                .filter(ProjectUser::isActive)
                                .collect(Collectors.groupingBy(
                                                ProjectUser::getRoleInProject,
                                                Collectors.counting()));

                // Calculate statistics by status
                long activeCount = projectUsers.stream()
                                .filter(ProjectUser::isActive)
                                .count();

                long pendingCount = projectUsers.stream()
                                .filter(ProjectUser::isPending)
                                .count();

                return MemberListResponse.builder()
                                .members(members)
                                .totalMembers((long) members.size())
                                .activeCount(activeCount)
                                .pendingCount(pendingCount)
                                .leaderCount(roleCounts.getOrDefault(ProjectRole.LEADER, 0L))
                                .memberCount(roleCounts.getOrDefault(ProjectRole.MEMBER, 0L))
                                .viewerCount(roleCounts.getOrDefault(ProjectRole.VIEWER, 0L))
                                .build();
        }

        /**
         * NEW: Simple conversion without statistics calculation.
         * Use this when statistics are provided separately via repository queries.
         */
        default MemberListResponse toListResponseSimple(List<ProjectUser> projectUsers) {
                List<MemberResponse> members = toResponseList(projectUsers);

                return MemberListResponse.builder()
                                .members(members)
                                .totalMembers((long) members.size())
                                .build();
        }
}
