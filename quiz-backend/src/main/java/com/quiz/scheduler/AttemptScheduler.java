package com.quiz.scheduler;

import com.quiz.entity.Attempt;
import com.quiz.enums.AttemptStatus;
import com.quiz.repository.AttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class AttemptScheduler {
    private final AttemptRepository attemptRepository;

    @Scheduled(cron = "0 0 4 * * ?")
    public void clearExpiredAttempts() {
        List<Attempt> attemptsInProgress = attemptRepository.findAllByStatus(AttemptStatus.IN_PROGRESS);
        LocalDateTime dayAgo = LocalDateTime.now().minusHours(24);

        List<Attempt> attemptsToBeDeleted = new ArrayList<>();

        for (Attempt attempt : attemptsInProgress) {
            boolean isOld = attempt.getStartedDate().isBefore(dayAgo);
            if (isOld) {
                attemptsToBeDeleted.add(attempt);
            }
        }

        attemptRepository.deleteAll(attemptsToBeDeleted);
    }
}
