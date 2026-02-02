package com.internalpj.crm_mini.mapper;

import com.internalpj.crm_mini.dto.request.ProjectCreateRequest;
import com.internalpj.crm_mini.dto.request.ProjectUpdateRequest;
import com.internalpj.crm_mini.dto.response.ProjectDetailResponse;
import com.internalpj.crm_mini.dto.response.ProjectResponse;
import com.internalpj.crm_mini.dto.response.MemberResponse;
import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.List;

/**
 * MapStruct mapper for converting between Project entities and DTOs.
 * MapStruct will auto-generate the implementation at compile time.
 */
@Mapper(componentModel = "spring")
public interface ProjectMapper {

    /**
     * Convert ProjectCreateRequest to Project entity.
     * Note: createdBy must be set separately in the service layer.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "projectUsers", ignore = true)
    Project toEntity(ProjectCreateRequest request);

    /**
     * Update existing Project entity from ProjectUpdateRequest.
     * Uses @MappingTarget to update fields in-place.
     * Only non-null fields from request will update the entity.
     * 
     * @param request the update request with new values
     * @param project the existing project entity to update
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    @Mapping(target = "projectUsers", ignore = true)
    @Mapping(target = "startDate", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(ProjectUpdateRequest request, @MappingTarget Project project);

    /**
     * Convert Project entity to ProjectResponse DTO.
     * 
     * @param project         the project entity
     * @param currentUserRole the role of the current user in this project
     * @param memberCount     total number of active members
     */
    @Mapping(target = "createdById", source = "project.createdBy.id")
    @Mapping(target = "createdByUsername", source = "project.createdBy.username")
    @Mapping(target = "currentUserRole", source = "currentUserRole")
    @Mapping(target = "memberCount", source = "memberCount")
    ProjectResponse toResponse(Project project, ProjectRole currentUserRole, Long memberCount);

    /**
     * Convert Project entity to ProjectDetailResponse DTO.
     * 
     * @param project         the project entity
     * @param currentUserRole the role of the current user in this project
     * @param members         list of member responses
     * @param statistics      role-based member counts
     */
    @Mapping(target = "createdById", source = "project.createdBy.id")
    @Mapping(target = "createdByUsername", source = "project.createdBy.username")
    @Mapping(target = "createdByEmail", source = "project.createdBy.email")
    @Mapping(target = "currentUserRole", source = "currentUserRole")
    @Mapping(target = "members", source = "members")
    @Mapping(target = "totalMembers", source = "statistics.totalMembers")
    @Mapping(target = "leaderCount", source = "statistics.leaderCount")
    @Mapping(target = "memberCount", source = "statistics.memberCount")
    @Mapping(target = "viewerCount", source = "statistics.viewerCount")
    ProjectDetailResponse toDetailResponse(
            Project project,
            ProjectRole currentUserRole,
            List<MemberResponse> members,
            RoleStatistics statistics);

    /**
     * Helper class to hold role-based statistics.
     */
    class RoleStatistics {
        private final Long totalMembers;
        private final Long leaderCount;
        private final Long memberCount;
        private final Long viewerCount;

        public RoleStatistics(Long totalMembers, Long leaderCount, Long memberCount, Long viewerCount) {
            this.totalMembers = totalMembers;
            this.leaderCount = leaderCount;
            this.memberCount = memberCount;
            this.viewerCount = viewerCount;
        }

        public Long getTotalMembers() {
            return totalMembers;
        }

        public Long getLeaderCount() {
            return leaderCount;
        }

        public Long getMemberCount() {
            return memberCount;
        }

        public Long getViewerCount() {
            return viewerCount;
        }
    }
}
