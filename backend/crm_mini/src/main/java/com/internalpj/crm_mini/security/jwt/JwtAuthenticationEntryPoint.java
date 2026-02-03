package com.internalpj.crm_mini.security.jwt;

import com.internalpj.crm_mini.error.ErrorResponse;
import com.internalpj.crm_mini.error.enums.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException) throws IOException {

        String requestURI = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        log.warn("Authentication failed for request: {} {}", request.getMethod(), requestURI);
        log.warn("Authorization header present: {}", authHeader != null);
        if (authHeader != null) {
            log.warn("Authorization header value: {}",
                    authHeader.substring(0, Math.min(20, authHeader.length())) + "...");
        }
        log.warn("Authentication exception: {}", authException.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                ErrorCode.UNAUTHORIZED.getCode(),
                ErrorCode.UNAUTHORIZED.getMessage(),
                LocalDate.now());

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        objectMapper.writeValue(response.getWriter(), errorResponse);
    }
}
