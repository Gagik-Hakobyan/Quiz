package com.quiz.service;

import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.question.QuestionFilterDto;
import com.quiz.dto.question.QuestionResponseDto;
import com.quiz.dto.question.QuestionSaveDto;
import com.quiz.dto.quiz.QuizStatsResponseDto;

import java.util.List;

public interface QuestionService {
    QuestionResponseDto create(long id, QuestionSaveDto questionSaveDto);

    PagingResponseDto getAllByQuizId(long id, QuestionFilterDto questionFilterDto);

    List<QuestionResponseDto> getAllPublishedByQuizId(long id);

    QuizStatsResponseDto getStats();

    QuestionResponseDto getByQuizId(long quizId, long questionId);
}
