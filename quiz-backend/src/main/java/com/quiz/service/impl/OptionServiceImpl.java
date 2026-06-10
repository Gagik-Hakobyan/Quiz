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
import com.quiz.service.OptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionServiceImpl implements OptionService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final OptionMapper optionMapper;

    @Override
    public OptionAdminResponseDto create(long quizId, long questionId, OptionSaveDto optionSaveDto) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + quizId + " not found")
        );

        if (quiz.getStatus() != QuizStatus.UNPUBLISHED) {
            throw new IllegalStateException("Quiz is already published or finished");
        }

        Question question = questionRepository.findByIdAndQuizId(questionId, quizId).orElseThrow(() ->
                new NotFoundException("Question by id: " + questionId + " not found")
        );

        if (question.getType().equals(QuestionType.MANUAL)) {
            throw new OperationNotAllowedException("Manual questions dont have options");
        }

        if (question.getType().equals(QuestionType.SINGLE) && optionSaveDto.isCorrect()) {
            List<Option> options = optionRepository.findAllByQuestionIdAndIsCorrect(questionId, true);

            if (options.size() == 1) {
                throw new IllegalArgumentException("Single answer question can not have more than one correct option");
            }
        }


        Option option = optionMapper.toEntity(optionSaveDto);
        option.setQuestion(question);
        OptionAdminResponseDto dto = optionMapper.toDto(optionRepository.save(option));
        dto.setCorrect(option.isCorrect());

        return dto;
    }

    @Override
    public List<OptionAdminResponseDto> getAllByQuestionId(long quizId, long questionId) {
        if (quizRepository.findById(quizId).isEmpty()) {
            throw new NotFoundException("Quiz by id: " + quizId + " not found");
        }

        Question question = questionRepository.findById(questionId).orElseThrow(() ->
                new NotFoundException("Question by id: " + questionId + " not found")
        );

        if (question.getQuiz().getId() != quizId) {
            throw new IllegalArgumentException("Invalid quiz or question id");
        }

        return optionMapper.toDtos(optionRepository.findAllByQuestionId(questionId));
    }
}
