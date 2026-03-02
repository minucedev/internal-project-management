package com.internalpj.crm_mini.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

/**
 * Service for sending emails asynchronously.
 * Uses Thymeleaf HTML templates for rich-formatted emails.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Value("${app.mail.from}")
    private String fromAddress;

    /**
     * Send project invitation email asynchronously.
     * Uses Thymeleaf HTML template: templates/email/invite.html
     *
     * @param to          recipient email
     * @param projectName name of the project
     * @param projectId   ID of the project
     * @param token       invitation token
     */
    @Async
    public void sendInviteEmail(String to, String projectName, Long projectId, String token) {
        try {
            String inviteUrl = frontendUrl + "/dashboard/projects/" + projectId + "/invites/" + token;

            // Build Thymeleaf context with template variables
            Context ctx = new Context();
            ctx.setVariable("projectName", projectName);
            ctx.setVariable("inviteUrl", inviteUrl);
            ctx.setVariable("expiryDays", 7);

            // Render HTML from template
            String html = templateEngine.process("email/invite", ctx);

            // Build MIME message
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject("You're invited to join " + projectName);
            helper.setText(html, true); // true = send as HTML

            mailSender.send(message);
            log.info("Invitation email sent successfully to: {}", to);

        } catch (MessagingException e) {
            log.error("Failed to send invitation email to: {}", to, e);
            // Don't throw — invitation record is already saved, email failure is
            // non-critical
        }
    }
}
