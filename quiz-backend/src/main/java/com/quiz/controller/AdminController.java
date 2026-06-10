package com.quiz.controller;

import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.answer.AnswerGradeRequestDto;
import com.quiz.dto.answer.AnswerResponseDto;
import com.quiz.dto.quiz.QuizStatsResponseDto;
import com.quiz.dto.option.OptionAdminResponseDto;
import com.quiz.dto.option.OptionSaveDto;
import com.quiz.dto.question.QuestionFilterDto;
import com.quiz.dto.question.QuestionResponseDto;
import com.quiz.dto.question.QuestionSaveDto;
import com.quiz.dto.quiz.QuizFilterDto;
import com.quiz.dto.quiz.QuizResponseDto;
import com.quiz.dto.quiz.QuizSaveDto;
import com.quiz.enums.QuizStatus;
import com.quiz.service.AnswerService;
import com.quiz.service.OptionService;
import com.quiz.service.QuestionService;
import com.quiz.service.QuizService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
@Validated
public class AdminController {
    private final QuizService quizService;
    private final QuestionService questionService;
    private final OptionService optionService;
    private final AnswerService answerService;

    @GetMapping("/quizzes")
    public ResponseEntity<PagingResponseDto> getQuizzes(
            @ModelAttribute @Valid QuizFilterDto quizFilterDto) {
        return ResponseEntity.ok(quizService.getAll(quizFilterDto));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponseDto> getQuiz(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id) {
        return ResponseEntity.ok(quizService.getById(id));
    }

    @PostMapping("/quizzes")
    public ResponseEntity<QuizResponseDto> createQuiz(
            @RequestBody @Valid QuizSaveDto quizSaveDto,
            Authentication authentication) {
        return ResponseEntity.ok(quizService.create(quizSaveDto, authentication.getName()));
    }

    @PatchMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponseDto> changeQuizStatus(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id,
            @RequestParam @NotNull QuizStatus quizStatus) {
        return ResponseEntity.ok(quizService.changeQuizStatus(id, quizStatus));
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<PagingResponseDto> getQuizQuestions(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long quizId,
            @ModelAttribute @Valid QuestionFilterDto questionFilterDto) {
        return ResponseEntity.ok(questionService.getAllByQuizId(quizId, questionFilterDto));
    }

    @GetMapping("/quizzes/{quizId}/questions/{questionId}")
    public ResponseEntity<QuestionResponseDto> getQuizQuestion(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long quizId,
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long questionId
    ) {
        return ResponseEntity.ok(questionService.getByQuizId(quizId, questionId));
    }

    @PostMapping("/quizzes/{id}/questions")
    public ResponseEntity<QuestionResponseDto> createQuestion(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long id,
            @RequestBody @Valid QuestionSaveDto questionSaveDto) {
        return ResponseEntity.ok(questionService.create(id, questionSaveDto));
    }

    @GetMapping("/quizzes/{quizId}/questions/{questionId}/options")
    public ResponseEntity<List<OptionAdminResponseDto>> getQuestionOptions(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long quizId,
            @PathVariable @NotNull @Min(value = 0, message = "Question Id must be at least 0") long questionId
            ) {
        return ResponseEntity.ok(optionService.getAllByQuestionId(quizId, questionId));
    }

    @PostMapping("/quizzes/{quizId}/questions/{questionId}/options")
    public ResponseEntity<OptionAdminResponseDto> createOption(
            @PathVariable @NotNull @Min(value = 0, message = "Quiz Id must be at least 0") long quizId,
            @PathVariable @NotNull @Min(value = 0, message = "Question Id must be at least 0") long questionId,
            @RequestBody @Valid OptionSaveDto optionSaveDto) {
        return ResponseEntity.ok(optionService.create(quizId, questionId, optionSaveDto));
    }

    @GetMapping("/stats")
    public ResponseEntity<QuizStatsResponseDto> getStats() {
        return ResponseEntity.ok(questionService.getStats());
    }

    @GetMapping("/reviews")
    public ResponseEntity<List<AnswerResponseDto>> getAnswersForReview() {
        return ResponseEntity.ok(answerService.getAnswersForReview());
    }

    @PatchMapping("/reviews/{answerId}")
    public ResponseEntity<AnswerResponseDto> gradeAnswer(
            @PathVariable long answerId,
            @RequestBody @Valid AnswerGradeRequestDto answerGradeRequestDto) {
        return ResponseEntity.ok(answerService.gradeAnswer(answerId, answerGradeRequestDto));
    }
}