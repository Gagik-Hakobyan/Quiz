package com.quiz.service.impl;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.quiz.QuizFilterDto;
import com.quiz.dto.quiz.QuizPublishedFilterDto;
import com.quiz.dto.quiz.QuizResponseDto;
import com.quiz.dto.quiz.QuizSaveDto;
import com.quiz.entity.QQuiz;
import com.quiz.entity.Question;
import com.quiz.entity.Quiz;
import com.quiz.entity.User;
import com.quiz.enums.QuizStatus;
import com.quiz.exception.NotFoundException;
import com.quiz.mapper.QuizMapper;
import com.quiz.repository.QuestionRepository;
import com.quiz.repository.QuizRepository;
import com.quiz.repository.UserRepository;
import com.quiz.service.QuizService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {
    private final EntityManager entityManager;
    private final QuizMapper quizMapper;
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    @Override
    public QuizResponseDto create(QuizSaveDto quizSaveDto, String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundException("User by email: " + email + " not found")
        );

        Quiz quiz = quizMapper.toEntity(quizSaveDto);
        quiz.setCreatedBy(user);
        quiz.setStatus(QuizStatus.UNPUBLISHED);

        return toDto(quizRepository.save(quiz));
    }

    @Override
    public PagingResponseDto getAll(QuizFilterDto quizFilterDto) {
        JPAQuery<Quiz> query = new JPAQuery<>(entityManager);
        QQuiz qQuiz = QQuiz.quiz;
        query.from(qQuiz);

        if (quizFilterDto.getCreatedFrom() != null
                && quizFilterDto.getCreatedTo() != null
                && quizFilterDto.getCreatedFrom().isAfter(quizFilterDto.getCreatedTo())) {
            throw new IllegalArgumentException("created from must be before created to");
        }
        if (StringUtils.isNoneBlank(quizFilterDto.getTitle())) {
            query.where(qQuiz.title.toLowerCase().contains(quizFilterDto.getTitle().toLowerCase()));
        }
        if (quizFilterDto.getStatus() != null) {
            query.where(qQuiz.status.eq(quizFilterDto.getStatus()));
        }
        if (quizFilterDto.getCreatedFrom() != null) {
            query.where(qQuiz.createdDate.goe(quizFilterDto.getCreatedFrom()));
        }
        if (quizFilterDto.getCreatedTo() != null) {
            query.where(qQuiz.createdDate.loe(quizFilterDto.getCreatedTo()));
        }


        long total = query.fetchCount();

        query.offset((long) quizFilterDto.getPage() * quizFilterDto.getSize());
        query.limit(quizFilterDto.getSize());

        String orderBy = switch (quizFilterDto.getOrderBy()) {
            case ID -> "id";
            case CREATED_DATE -> "createdDate";
        };

        PathBuilder<Object> expression = new PathBuilder<>(Quiz.class, "quiz");
        PathBuilder<Object> fieldPath = expression.get(orderBy);

        OrderSpecifier orderSpecifier = new OrderSpecifier(
                quizFilterDto.getOrderDirection(), fieldPath);
        query.orderBy(orderSpecifier);

        return PagingResponseDto.builder()
                .data(toDtos(query.fetch()))
                .total(total)
                .page(quizFilterDto.getPage())
                .size(quizFilterDto.getSize())
                .build();
    }

    @Override
    public QuizResponseDto changeQuizStatus(long id, QuizStatus quizStatus) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + id + " not found")
        );

        if (quiz.getStatus().equals(quizStatus)) {
            throw new IllegalArgumentException("Quiz status must be changed");
        }

        quiz.setStatus(quizStatus);
        return toDto(quizRepository.save(quiz));
    }

    @Override
    public PagingResponseDto getAllPublished(QuizPublishedFilterDto quizPublishedFilterDto) {
        JPAQuery<Quiz> query = new JPAQuery<>(entityManager);
        QQuiz qQuiz = QQuiz.quiz;
        query.from(qQuiz);
        query.where(qQuiz.status.eq(QuizStatus.PUBLISHED));

        if (quizPublishedFilterDto.getCreatedFrom() != null
                && quizPublishedFilterDto.getCreatedTo() != null
                && quizPublishedFilterDto.getCreatedFrom().isAfter(quizPublishedFilterDto.getCreatedTo())) {
            throw new IllegalArgumentException("Created From date must be before Created To date");
        }
        if (StringUtils.isNoneBlank(quizPublishedFilterDto.getTitle())) {
            query.where(qQuiz.title.toLowerCase().contains(quizPublishedFilterDto.getTitle().toLowerCase()));
        }
        if (quizPublishedFilterDto.getCreatedFrom() != null) {
            query.where(qQuiz.createdDate.goe(quizPublishedFilterDto.getCreatedFrom()));
        }
        if (quizPublishedFilterDto.getCreatedTo() != null) {
            query.where(qQuiz.createdDate.loe(quizPublishedFilterDto.getCreatedTo()));
        }

        long total = query.fetchCount();

        query.offset((long) quizPublishedFilterDto.getPage() * quizPublishedFilterDto.getSize());
        query.limit(quizPublishedFilterDto.getSize());

        PathBuilder<Object> expression = new PathBuilder<>(Quiz.class, "quiz");
        PathBuilder<Object> fieldPath = expression.get("createdDate");

        OrderSpecifier orderSpecifier = new OrderSpecifier(
                quizPublishedFilterDto.getOrderDirection(), fieldPath);
        query.orderBy(orderSpecifier);

        return PagingResponseDto.builder()
                .data(toDtos(query.fetch()))
                .total(total)
                .page(quizPublishedFilterDto.getPage())
                .size(quizPublishedFilterDto.getSize())
                .build();
    }

    @Override
    public QuizResponseDto getPublishedById(long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + id + " not found")
        );

        if (quiz.getStatus() != QuizStatus.PUBLISHED) {
            throw new NotFoundException("Quiz by id: " + id + " not found");
        }

        return toDto(quiz);
    }

    @Override
    public QuizResponseDto getById(long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id " + id + " not found")
        );
        return toDto(quiz);
    }

    private QuizResponseDto toDto(Quiz quiz) {
        QuizResponseDto dto = quizMapper.toDto(quiz);
        dto.setQuestionCount(questionRepository.countByQuizId(quiz.getId()));
        dto.setMaxPoints(getMaxPointsById(quiz.getId()));
        return dto;
    }

    private List<QuizResponseDto> toDtos(List<Quiz> quizzes) {
        List<QuizResponseDto> dtos = new ArrayList<>();
        for (Quiz quiz : quizzes) {
            dtos.add(toDto(quiz));
        }
        return dtos;
    }

    private int getMaxPointsById(long quizId) {
        List<Question> questions = questionRepository.findAllByQuizId(quizId);
        int maxPoints = 0;

        for (Question question : questions) {
            maxPoints += question.getPoints();
        }
        return maxPoints;
    }
}
