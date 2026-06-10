package com.quiz.service;

import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.quiz.QuizFilterDto;
import com.quiz.dto.quiz.QuizPublishedFilterDto;
import com.quiz.dto.quiz.QuizResponseDto;
import com.quiz.dto.quiz.QuizSaveDto;
import com.quiz.enums.QuizStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.Nullable;

public interface QuizService {
    QuizResponseDto create(QuizSaveDto quizSaveDto, String email);

    PagingResponseDto getAll(QuizFilterDto quizFilterDto);

    QuizResponseDto changeQuizStatus(long id, QuizStatus quizStatus);

    PagingResponseDto getAllPublished(QuizPublishedFilterDto quizPublishedFilterDto);

    QuizResponseDto getPublishedById(long id);

    QuizResponseDto getById(long id);
}
