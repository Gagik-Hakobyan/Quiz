package com.quiz.repository;

import com.quiz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    int countByQuizId(long quizId);

    List<Question> findAllByQuizId(long quizId);

    Optional<Question> findByIdAndQuizId(long id, long quizId);
}
