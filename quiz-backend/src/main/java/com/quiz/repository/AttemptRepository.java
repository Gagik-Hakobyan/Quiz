package com.quiz.repository;

import com.quiz.entity.Attempt;
import com.quiz.enums.AttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    boolean existsByQuizIdAndUserIdAndStatusNot(long quizId, long userId, AttemptStatus status);

    Optional<Attempt> findByQuizIdAndUserIdAndStatus(long quizId, long id, AttemptStatus status);

    Optional<Attempt> findByQuizIdAndUserId(long quizId, long userId);

    List<Attempt> findAllByUserId(long userId);

    List<Attempt> findAllByUserEmail(String userEmail);

    List<Attempt> findAllByStatus(AttemptStatus status);
}
