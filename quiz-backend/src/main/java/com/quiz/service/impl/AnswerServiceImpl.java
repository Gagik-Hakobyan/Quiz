package com.quiz.service.impl;

import com.quiz.dto.answer.AnswerGradeRequestDto;
import com.quiz.dto.answer.AnswerResponseDto;
import com.quiz.entity.Answer;
import com.quiz.entity.Attempt;
import com.quiz.enums.AttemptStatus;
import com.quiz.exception.NotFoundException;
import com.quiz.mapper.AnswerMapper;
import com.quiz.repository.AnswerRepository;
import com.quiz.repository.AttemptRepository;
import com.quiz.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnswerServiceImpl implements AnswerService {
    private final AnswerRepository answerRepository;
    private final AttemptRepository attemptRepository;
    private final AnswerMapper answerMapper;

    @Override
    public List<AnswerResponseDto> getAnswersForReview() {
        List<AnswerResponseDto> answers = new ArrayList<>();

        for (Answer answer : answerRepository.findAllByTextAnswerIsNotNullAndEarnedPoints(0)) {
            answers.add(answerMapper.toDto(answer));
        }
        return answers;
    }

    @Override
    @Transactional
    public AnswerResponseDto gradeAnswer(long answerId, AnswerGradeRequestDto dto) {
        Answer currentAnswer = answerRepository.findById(answerId).orElseThrow(() ->
                new NotFoundException("Answer by id: " + answerId + " not found")
        );

        if (dto.getEarnedPoints() > currentAnswer.getQuestion().getPoints()) {
            throw new IllegalArgumentException("Incorrect points");
        }

        currentAnswer.setEarnedPoints(dto.getEarnedPoints());
        answerRepository.save(currentAnswer);

        Attempt attempt = currentAnswer.getAttempt();
        Map<Long, Integer> pointsByQuestion = new HashMap<>();

        for (Answer answer : answerRepository.findAllByAttemptId(attempt.getId())) {
            long questionId = answer.getQuestion().getId();
            if (!pointsByQuestion.containsKey(questionId)) {
                pointsByQuestion.put(questionId, answer.getEarnedPoints());
            }
        }

        int total = 0;
        for (int points : pointsByQuestion.values()) {
            total += points;
        }

        attempt.setCurrentPoints(total);
        attempt.setStatus(AttemptStatus.CHECKED);
        attemptRepository.save(attempt);

        return answerMapper.toDto(currentAnswer);
    }
}
