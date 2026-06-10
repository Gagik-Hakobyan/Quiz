package com.quiz.service;

import com.quiz.dto.attempt.AttemptRequestDto;
import com.quiz.dto.attempt.AttemptResponseDto;

import java.util.List;

public interface AttemptService {
    AttemptResponseDto createAttempt(long quizId, String email);

    AttemptResponseDto submit(long id, String email, AttemptRequestDto attemptRequestDto);

    AttemptResponseDto getByQuizId(long id, String email);

    AttemptResponseDto getById(long id, String email);

    List<AttemptResponseDto> getAllByUserEmail(String email);
}
