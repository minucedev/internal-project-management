package com.internalpj.crm_mini.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service for sending emails.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * Send project invitation email.
     *
     * @param to          recipient email
     * @param projectName name of the project
     * @param token       invitation token
     */
    public void sendInviteEmail(String to, String projectName, String token) {
        try {
            String inviteUrl = frontendUrl + "/invites/" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("You're invited to join " + projectName);
            message.setText(
                    "Hello,\n\n" +
                            "You've been invited to join the project: " + projectName + "\n\n" +
                            "Click the link below to accept the invitation:\n" +
                            inviteUrl + "\n\n" +
                            "This invitation will expire in 7 days.\n\n" +
                            "If you did not expect this invitation, you can safely ignore this email.\n\n" +
                            "Best regards,\n" +
                            "Project Management Team");

            mailSender.send(message);
            log.info("Invitation email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send invitation email to: {}", to, e);
            // Don't throw exception - invitation still created, just email failed
        }
    }
}
