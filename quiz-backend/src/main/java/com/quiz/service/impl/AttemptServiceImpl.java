package com.quiz.service.impl;

import com.quiz.dto.answer.AnswerSaveDto;
import com.quiz.dto.attempt.AttemptRequestDto;
import com.quiz.dto.attempt.AttemptResponseDto;
import com.quiz.entity.*;
import com.quiz.enums.AttemptStatus;
import com.quiz.enums.QuestionType;
import com.quiz.enums.QuizStatus;
import com.quiz.exception.NotFoundException;
import com.quiz.exception.OperationNotAllowedException;
import com.quiz.mapper.AttemptMapper;
import com.quiz.repository.*;
import com.quiz.service.AttemptService;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttemptServiceImpl implements AttemptService {
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final UserRepository userRepository;
    private final AnswerRepository answerRepository;
    private final OptionRepository optionRepository;
    private final AttemptMapper attemptMapper;



    @Override
    public AttemptResponseDto createAttempt(long quizId, String email) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + quizId + " not found")
        );

        if (quiz.getStatus() != QuizStatus.PUBLISHED) {
            throw new NotFoundException("Quiz by id: " + quizId + " not found");
        }

        User user = getUserByEmail(email);

        Optional<Attempt> attempt =
                attemptRepository.findByQuizIdAndUserIdAndStatus(quizId, user.getId(), AttemptStatus.IN_PROGRESS);
        if (attempt.isPresent()) {
            return attemptMapper.toDto(attempt.get());
        }

        if (attemptRepository.existsByQuizIdAndUserIdAndStatusNot(quizId, user.getId(), AttemptStatus.IN_PROGRESS)) {
            throw new OperationNotAllowedException("User have already completed this quiz");
        }

        List<Question> questions = questionRepository.findAllByQuizId((quizId));

        if (questions.size() < 2) {
            throw new OperationNotAllowedException("Quiz must contain at least 2 questions");
        }

        int maxPoints = 0;
        for (Question question : questions) {
            maxPoints += question.getPoints();
        }


        return attemptMapper.toDto(attemptRepository.save(Attempt.builder()
                .user(user)
                .quiz(quiz)
                .maxPoints(maxPoints)
                .build()));
    }

    @Override
    @Transactional
    public AttemptResponseDto submit(long id, String email, AttemptRequestDto attemptRequestDto) {
        Attempt attempt = attemptRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Attempt by id: " + id + " not found")
        );

        if (!attempt.getUser().getEmail().equals(email)) {
            throw new NotFoundException("Attempt by id: " + id + " not found");
        }

        if (!attempt.getStatus().equals(AttemptStatus.IN_PROGRESS)) {
            throw new OperationNotAllowedException("Attempt already completed");
        }

        List<Question> questions = questionRepository.findAllByQuizId(attempt.getQuiz().getId());
        List<AnswerSaveDto> answersDtos = attemptRequestDto.getAnswers();

        if (answersDtos.size() != questions.size()) {
            throw new IllegalArgumentException("You must answer each question once");
        }

        validateAnswers(questions, answersDtos);

        Map<Long, Question> questionMap = new HashMap<>();
        for (Question question : questions) {
            questionMap.put(question.getId(), question);
        }

        boolean hasManual = false;
        List<Answer> answersToSave = new ArrayList<>();

        for (AnswerSaveDto answerDto : answersDtos) {
            Question question = questionMap.get(answerDto.getQuestionId());

            if (question.getType().equals(QuestionType.MANUAL)) {
                if (StringUtils.isBlank(answerDto.getTextAnswer())) {
                    throw new IllegalArgumentException("Text answer is required for manual question: " + question.getBody());
                }

                Answer answer = new Answer();
                answer.setAttempt(attempt);
                answer.setQuestion(question);
                answer.setTextAnswer(answerDto.getTextAnswer());
                answersToSave.add(answer);
                hasManual = true;
            } else {
                validateOptionIds(answerDto, question);
                List<Option> questionOptions = optionRepository.findAllByQuestionId(question.getId());

                Map<Long, Option> optionMap = new HashMap<>();
                for (Option option : questionOptions) {
                    optionMap.put(option.getId(), option);
                }

                for (Long optionId : answerDto.getOptionIds()) {
                    if (!optionMap.containsKey(optionId)) {
                        throw new OperationNotAllowedException("Incorrect options");
                    }
                }

                List<Option> selectedOptions = new ArrayList<>();
                for (Long optionId : answerDto.getOptionIds()) {
                    selectedOptions.add(optionMap.get(optionId));
                }


                int points = calculatePoints(question, questionOptions, selectedOptions);
                for (Option selectedOption : selectedOptions) {
                    Answer answer = new Answer();
                    answer.setAttempt(attempt);
                    answer.setQuestion(question);
                    answer.setSelectedOption(selectedOption);
                    answer.setEarnedPoints(points);
                    answersToSave.add(answer);
                }

            }
        }

        answerRepository.saveAll(answersToSave);

        Map<Long, Integer> pointsByQuestion = new HashMap<>();
        for (Answer answer : answersToSave) {
            long questionId = answer.getQuestion().getId();
            if (!pointsByQuestion.containsKey(questionId)) {
                pointsByQuestion.put(questionId, answer.getEarnedPoints());
            }
        }

        int totalPoints = 0;
        for (int points : pointsByQuestion.values()) {
            totalPoints += points;
        }

        attempt.setCurrentPoints(totalPoints);
        attempt.setEndedDate(LocalDateTime.now());
        attempt.setStatus(hasManual ? AttemptStatus.CHECKED : AttemptStatus.COMPLETED);
        return attemptMapper.toDto(attemptRepository.save(attempt));
    }

    @Override
    public AttemptResponseDto getByQuizId(long id, String email) {
        User user = getUserByEmail(email);

        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + id + " not found")
        );

        Attempt attempt = attemptRepository.findByQuizIdAndUserId(quiz.getId(), user.getId()).orElseThrow(() ->
                new NotFoundException("Attempt by quiz id: " + quiz.getId() + " not found")
        );
        return attemptMapper.toDto(attempt);
    }

    @Override
    public AttemptResponseDto getById(long id, String email) {
        Attempt attempt = attemptRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Attempt by id: " + id + " not found")
        );

        if (!attempt.getUser().getEmail().equals(email)) {
            throw new NotFoundException("Attempt by id: " + id + " not found");
        }
        return attemptMapper.toDto(attempt);
    }

    @Override
    public List<AttemptResponseDto> getAllByUserEmail(String email) {
        getUserByEmail(email);
        return attemptMapper.toDtos(attemptRepository.findAllByUserEmail(email));
    }

    private int calculatePoints(
            Question question,
            List<Option> questionOptions,
            List<Option> selectedOptions
    ) {
        Set<Long> correctOptionIds = new HashSet<>();
        for (Option option : questionOptions) {
            if (option.isCorrect()) {
                correctOptionIds.add(option.getId());
            }
        }

        Set<Long> selectedOptionIds = new HashSet<>();
        for (Option option : selectedOptions) {
            selectedOptionIds.add(option.getId());
        }


        return selectedOptionIds.equals(correctOptionIds) ? question.getPoints() : 0;
    }

    private void validateAnswers(List<Question> questions, List<AnswerSaveDto> answers) {
        List<Long> missingQuestionIds = new ArrayList<>();

        for (Question question : questions) {
            boolean found = false;
            for (AnswerSaveDto answer : answers) {
                if (answer.getQuestionId().equals(question.getId())) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                missingQuestionIds.add(question.getId());
            }
        }

        if (!missingQuestionIds.isEmpty()) {
            throw new IllegalArgumentException("Answers are missing for questions: " + missingQuestionIds);
        }
    }

    private void validateOptionIds(AnswerSaveDto answerDto, Question question) {
        if (answerDto.getOptionIds() == null || answerDto.getOptionIds().isEmpty()) {
            throw new IllegalArgumentException(
                    "Answer for question: " + question.getId() + " is required"
            );
        }

        Set<Long> uniqueIds = new HashSet<>(answerDto.getOptionIds());
        if (uniqueIds.size() != answerDto.getOptionIds().size()) {
            throw new OperationNotAllowedException(
                    "Duplicate answer ids are not allowed for question: " + question.getId()
            );
        }

        if (question.getType().equals(QuestionType.SINGLE) && uniqueIds.size() > 1) {
            throw new IllegalArgumentException(
                    "Only one answer allowed for question: " + question.getId()
            );
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundException("User by email: " + email + " not found")
        );
    }
}
