package com.internalpj.crm_mini.security.jwt;

import com.internalpj.crm_mini.controller.auth.enums.RoleType;
import com.internalpj.crm_mini.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Slf4j
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtTokenProvider jwtTokenProvider,
            UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String requestURI = request.getRequestURI();
        log.debug("Processing request: {} {}", request.getMethod(), requestURI);

        // Get token from header
        String token = getTokenFromRequest(request);

        if (token != null) {
            log.debug("Token found in request for URI: {}", requestURI);
        } else {
            log.debug("No token found in request for URI: {}", requestURI);
        }

        // Validate token
        if (token != null && jwtTokenProvider.validateToken(token)) {
            log.debug("Token is valid");
            Long userId = jwtTokenProvider.getUserIdFromToken(token);
            log.debug("Extracted userId from token: {}", userId);

            // Load user form DB
            userRepository.findById(userId).ifPresent(user -> {
                log.debug("User found in database: {} (id: {})", user.getEmail(), user.getId());
                // Generate authorities
                List<org.springframework.security.core.GrantedAuthority> authorities = Collections.singletonList(
                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                user.getRole() != null ? RoleType.fromId(user.getRole().getId()).getRole()
                                        : RoleType.USER.getRole())); // avoid null role
                // Set authentication in SecurityContext
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        authorities);

                SecurityContextHolder.getContext().setAuthentication(authentication);
                log.debug("Authentication set in SecurityContext for user: {}", user.getEmail());
            });

            if (userRepository.findById(userId).isEmpty()) {
                log.warn("User with id {} not found in database", userId);
            }
        } else if (token != null) {
            log.warn("Invalid token for URI: {}", requestURI);
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        return null;
    }
}
