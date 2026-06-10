package com.quiz.controller;

import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.attempt.AttemptRequestDto;
import com.quiz.dto.attempt.AttemptResponseDto;
import com.quiz.dto.question.QuestionResponseDto;
import com.quiz.dto.quiz.QuizPublishedFilterDto;
import com.quiz.dto.quiz.QuizResponseDto;
import com.quiz.dto.user.UserResponseDto;
import com.quiz.mapper.UserMapper;
import com.quiz.service.AttemptService;
import com.quiz.service.QuestionService;
import com.quiz.service.QuizService;
import com.quiz.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;
    private final QuizService quizService;
    private final QuestionService questionService;
    private final AttemptService attemptService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getUser(Authentication authentication) {
        return ResponseEntity.ok(userMapper.toDto(userService.getByEmail(authentication.getName())));
    }

    @GetMapping("/quizzes")
    public ResponseEntity<PagingResponseDto> getQuizzes(
            @ModelAttribute @Valid QuizPublishedFilterDto quizPublishedFilterDto) {
        return ResponseEntity.ok(quizService.getAllPublished(quizPublishedFilterDto));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponseDto> getQuiz(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id) {
        return ResponseEntity.ok(quizService.getPublishedById(id));
    }

    @GetMapping("/quizzes/{id}/questions")
    public ResponseEntity<List<QuestionResponseDto>> getQuizQuestions(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id) {
        return ResponseEntity.ok(questionService.getAllPublishedByQuizId(id));
    }

    @GetMapping("/quizzes/{id}/start")
    public ResponseEntity<AttemptResponseDto> startQuiz(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(attemptService.createAttempt(id, authentication.getName()));
    }

    @GetMapping("/quizzes/{id}/attempts")
    public ResponseEntity<AttemptResponseDto> getAttemptByQuizId(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id,
            Authentication authentication) {
        return ResponseEntity.ok(attemptService.getByQuizId(id, authentication.getName()));
    }

    @GetMapping("/attempts/{id}")
    public ResponseEntity<AttemptResponseDto> getAttempt(
            @PathVariable @NotNull @Min(value = 0, message = "Attempt Id must be at least 0") long id,
            Authentication authentication) {
        return ResponseEntity.ok(attemptService.getById(id, authentication.getName()));
    }

    @GetMapping("/attempts")
    public ResponseEntity<List<AttemptResponseDto>> getUserAttempts(Authentication authentication) {
        return ResponseEntity.ok(attemptService.getAllByUserEmail(authentication.getName()));
    }

    @PostMapping("/attempts/{id}/submit")
    public ResponseEntity<AttemptResponseDto> submitAttempt(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id,
            @RequestBody @Validated AttemptRequestDto attemptRequestDto,
            Authentication authentication
    ) {
        return ResponseEntity.ok(attemptService.submit(id, authentication.getName(), attemptRequestDto));
    }
}
