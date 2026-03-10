package com.internalpj.crm_mini.interceptor;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.enums.ProjectRole;
import com.internalpj.crm_mini.error.ErrorResponse;
import com.internalpj.crm_mini.error.enums.ErrorCode;
import com.internalpj.crm_mini.repository.ProjectRepository;
import com.internalpj.crm_mini.repository.ProjectUserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.HandlerMapping;

import java.util.Map;
import java.util.Optional;

/**
 * Interceptor that verifies the authenticated user is an active member of
 * the requested project and attaches their role as a request attribute.
 *
 * <p>
 * Applies to: {@code /api/projects/{projectId}/tasks/**}
 *
 * <p>
 * Sets request attributes:
 * <ul>
 * <li>{@code projectRole} — the user's {@link ProjectRole} in the project</li>
 * <li>{@code currentUserId} — the authenticated user's ID</li>
 * </ul>
 */
@Component
@RequiredArgsConstructor
public class ProjectRoleInterceptor implements HandlerInterceptor {

    public static final String ATTR_PROJECT_ROLE = "projectRole";
    public static final String ATTR_CURRENT_USER_ID = "currentUserId";

    private final ProjectUserRepository projectUserRepository;
    private final ProjectRepository projectRepository;
    private final ObjectMapper objectMapper;

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response,
            Object handler) throws Exception {

        Long projectId = extractProjectId(request);
        if (projectId == null) {
            // Path template not resolved yet — let Spring handle the 404
            return true;
        }

        // 1. Verify project exists (not soft-deleted)
        if (!projectRepository.existsByIdAndDeletedAtIsNull(projectId)) {
            writeError(response, HttpServletResponse.SC_NOT_FOUND,
                    ErrorCode.PROJECT_NOT_FOUND);
            return false;
        }

        // 2. Get current authenticated user
        Long userId = extractCurrentUserId();
        if (userId == null) {
            writeError(response, HttpServletResponse.SC_FORBIDDEN,
                    ErrorCode.NOT_AUTHENTICATED);
            return false;
        }

        // 3. Check active membership and load role
        Optional<ProjectRole> roleOpt = projectUserRepository
                .findRoleByProjectIdAndUserId(projectId, userId);

        if (roleOpt.isEmpty()) {
            writeError(response, HttpServletResponse.SC_FORBIDDEN,
                    ErrorCode.NOT_PROJECT_MEMBER);
            return false;
        }

        // 4. Verify status is ACTIVE (findRoleByProjectIdAndUserId already filters by
        // ACTIVE)
        request.setAttribute(ATTR_PROJECT_ROLE, roleOpt.get());
        request.setAttribute(ATTR_CURRENT_USER_ID, userId);
        return true;
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private Long extractProjectId(HttpServletRequest request) {
        Object uriVars = request.getAttribute(
                HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
        if (uriVars instanceof Map<?, ?> map) {
            Object val = map.get("projectId");
            if (val != null) {
                try {
                    return Long.parseLong(val.toString());
                } catch (NumberFormatException ignored) {
                }
            }
        }
        return null;
    }

    private Long extractCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated())
            return null;
        Object principal = auth.getPrincipal();
        if (principal instanceof User u)
            return u.getId();
        if (principal instanceof Long l)
            return l;
        try {
            return Long.parseLong(principal.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private void writeError(HttpServletResponse response,
            int status,
            ErrorCode errorCode) throws Exception {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        ErrorResponse body = new ErrorResponse(
                errorCode.getCode(),
                errorCode.getMessage(),
                java.time.LocalDate.now());
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
