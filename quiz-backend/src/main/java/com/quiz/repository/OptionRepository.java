package com.quiz.repository;

import com.quiz.entity.Option;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OptionRepository extends JpaRepository<Option, Long> {
    List<Option> findAllByQuestionIdAndIsCorrect(long questionId, boolean isCorrect);

    List<Option> findAllByQuestionId(long questionId);

    int countByQuestionId(long questionId);
}
