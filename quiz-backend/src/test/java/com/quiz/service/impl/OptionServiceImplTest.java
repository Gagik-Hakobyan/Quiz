package com.quiz.service.impl;

import com.quiz.dto.option.OptionAdminResponseDto;
import com.quiz.dto.option.OptionSaveDto;
import com.quiz.entity.Option;
import com.quiz.entity.Question;
import com.quiz.entity.Quiz;
import com.quiz.enums.QuestionType;
import com.quiz.enums.QuizStatus;
import com.quiz.exception.NotFoundException;
import com.quiz.exception.OperationNotAllowedException;
import com.quiz.mapper.OptionMapper;
import com.quiz.repository.OptionRepository;
import com.quiz.repository.QuestionRepository;
import com.quiz.repository.QuizRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OptionServiceImplTest {
    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private OptionRepository optionRepository;

    @Mock
    private OptionMapper optionMapper;

    @InjectMocks
    private OptionServiceImpl optionService;

    @Test
    void create_ShouldThrowException_WhenQuizIsNotFound() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> optionService.create(1L, 1L, new OptionSaveDto()));
    }

    @Test
    void create_ShouldThrowException_WhenQuizStatusIsNotUnpublished() {
        Quiz quiz = new Quiz();
        quiz.setStatus(QuizStatus.PUBLISHED);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        assertThrows(IllegalStateException.class, () -> optionService.create(1L, 1L, new OptionSaveDto()));
    }

    @Test
    void create_ShouldThrowException_WhenQuestionIsNotFound() {
        Quiz quiz = new Quiz();
        quiz.setStatus(QuizStatus.UNPUBLISHED);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByIdAndQuizId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> optionService.create(1L, 1L, new OptionSaveDto()));
    }

    @Test
    void create_ShouldThrowException_WhenQuestionTypeIsManual() {
        Quiz quiz = new Quiz();
        quiz.setStatus(QuizStatus.UNPUBLISHED);

        Question question = new Question();
        question.setQuiz(quiz);
        question.setType(QuestionType.MANUAL);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByIdAndQuizId(1L, 1L)).thenReturn(Optional.of(question));

        assertThrows(OperationNotAllowedException.class, () -> optionService.create(1L, 1L, new OptionSaveDto()));
    }

    @Test
    void create_ShouldThrowException_WhenSingleAnswerQuestionHaveMoreThanOneCorrectOption() {
        Quiz quiz = new Quiz();
        quiz.setStatus(QuizStatus.UNPUBLISHED);

        Question question = new Question();
        question.setType(QuestionType.SINGLE);

        OptionSaveDto optionSaveDto = new OptionSaveDto();
        optionSaveDto.setCorrect(true);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByIdAndQuizId(1L, 1L)).thenReturn(Optional.of(question));
        when(optionRepository.findAllByQuestionIdAndIsCorrect(1L, true)).thenReturn(List.of(new Option()));

        assertThrows(IllegalArgumentException.class, () -> optionService.create(1L, 1L, optionSaveDto));
    }

    @Test
    void create_ShouldCreate() {
        Quiz quiz = new Quiz();
        quiz.setStatus(QuizStatus.UNPUBLISHED);

        Question question = new Question();
        question.setType(QuestionType.SINGLE);

        OptionSaveDto optionSaveDto = new OptionSaveDto();
        optionSaveDto.setCorrect(true);

        Option option = new Option();
        option.setQuestion(question);

        OptionAdminResponseDto optionAdminResponseDto = new OptionAdminResponseDto();
        optionAdminResponseDto.setCorrect(option.isCorrect());

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findByIdAndQuizId(1L, 1L)).thenReturn(Optional.of(question));
        when(optionRepository.findAllByQuestionIdAndIsCorrect(1L, true)).thenReturn(List.of());
        when(optionMapper.toEntity(optionSaveDto)).thenReturn(option);
        when(optionRepository.save(option)).thenReturn(option);
        when(optionMapper.toDto(option)).thenReturn(optionAdminResponseDto);

        OptionAdminResponseDto result = optionService.create(1L, 1L, optionSaveDto);

        assertEquals(optionAdminResponseDto, result);
        verify(optionRepository).save(option);
    }

    @Test
    void getAllByQuestionId_ShouldThrowException_WhenQuizIsNotFound() {
        when(quizRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> optionService.getAllByQuestionId(1L, 1L));
    }

    @Test
    void getAllByQuestionId_ShouldThrowException_WhenQuestionIsNotFound() {
        when(quizRepository.findById(1L)).thenReturn(Optional.of(new Quiz()));
        when(questionRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> optionService.getAllByQuestionId(1L, 1L));
    }

    @Test
    void getAllByQuestionId_ShouldThrowException_WhenQuizIdIsInvalid() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);

        Quiz anotherQuiz = new Quiz();
        anotherQuiz.setId(2L);

        Question question = new Question();
        question.setQuiz(anotherQuiz);

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        assertThrows(IllegalArgumentException.class, () -> optionService.getAllByQuestionId(1L, 1L));
    }

    @Test
    void getAllByQuestionId_ShouldReturnAllOptions() {
        Quiz quiz = new Quiz();
        quiz.setId(1L);

        Question question = new Question();
        question.setQuiz(quiz);

        List<Option> options = new ArrayList<>();
        List<OptionAdminResponseDto> dtos = new ArrayList<>();

        when(quizRepository.findById(1L)).thenReturn(Optional.of(quiz));
        when(questionRepository.findById(1L)).thenReturn(Optional.of(question));
        when(optionRepository.findAllByQuestionId(1L)).thenReturn(options);
        when(optionMapper.toDtos(options)).thenReturn(dtos);

        List<OptionAdminResponseDto> result = optionService.getAllByQuestionId(1L, 1L);

        assertEquals(dtos, result);
    }
}