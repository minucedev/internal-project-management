package com.internalpj.crm_mini.config;

import com.internalpj.crm_mini.interceptor.ProjectRoleInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Registers application-level HandlerInterceptors.
 */
@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebMvcConfigurer {

    private final ProjectRoleInterceptor projectRoleInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(projectRoleInterceptor)
                .addPathPatterns("/api/projects/*/tasks/**");
    }
}
