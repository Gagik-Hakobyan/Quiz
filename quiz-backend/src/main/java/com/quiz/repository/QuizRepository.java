package com.quiz.repository;

import com.quiz.entity.Quiz;
import com.quiz.enums.QuizStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    long countByStatus(QuizStatus status);
}
