package com.internalpj.crm_mini.scheduler;

import com.internalpj.crm_mini.entity.Project;
import com.internalpj.crm_mini.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled job to automatically clean up old trashed projects.
 * Runs daily at midnight to permanently delete projects that have been in trash
 * for more than 15 days.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectCleanupScheduler {

    private final ProjectRepository projectRepository;

    /**
     * Automatically delete projects that have been in trash for more than 15 days.
     * Runs daily at midnight (00:00:00).
     */
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void cleanupOldTrashedProjects() {
        log.info("Starting scheduled cleanup of old trashed projects...");

        // Calculate cutoff date (15 days ago)
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);

        // Find projects deleted before cutoff date
        List<Project> oldTrashedProjects = projectRepository.findProjectsDeletedBefore(cutoffDate);

        if (oldTrashedProjects.isEmpty()) {
            log.info("No old trashed projects found for cleanup");
            return;
        }

        log.info("Found {} projects deleted before {} for permanent deletion",
                oldTrashedProjects.size(), cutoffDate);

        // Permanently delete old trashed projects
        projectRepository.deleteAll(oldTrashedProjects);

        log.warn("AUTO CLEANUP: Permanently deleted {} projects that were in trash for more than 15 days",
                oldTrashedProjects.size());
    }
}
