package com.quiz.service;

import com.quiz.dto.answer.AnswerGradeRequestDto;
import com.quiz.dto.answer.AnswerResponseDto;
import jakarta.validation.Valid;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface AnswerService {

    List<AnswerResponseDto> getAnswersForReview();

    AnswerResponseDto gradeAnswer(long answerId, AnswerGradeRequestDto answerGradeRequestDto);
}
