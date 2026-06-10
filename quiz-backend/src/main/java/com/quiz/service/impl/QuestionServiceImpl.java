package com.quiz.service.impl;

import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.quiz.dto.PagingResponseDto;
import com.quiz.dto.question.QuestionFilterDto;
import com.quiz.dto.question.QuestionResponseDto;
import com.quiz.dto.question.QuestionSaveDto;
import com.quiz.dto.quiz.QuizStatsResponseDto;
import com.quiz.entity.QQuestion;
import com.quiz.entity.Question;
import com.quiz.entity.Quiz;
import com.quiz.enums.QuizStatus;
import com.quiz.exception.NotFoundException;
import com.quiz.mapper.OptionMapper;
import com.quiz.mapper.QuestionMapper;
import com.quiz.repository.AttemptRepository;
import com.quiz.repository.OptionRepository;
import com.quiz.repository.QuestionRepository;
import com.quiz.repository.QuizRepository;
import com.quiz.service.QuestionService;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final EntityManager entityManager;
    private final QuestionMapper questionMapper;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;
    private final OptionRepository optionRepository;
    private final OptionMapper optionMapper;

    @Override
    public QuestionResponseDto create(long id, QuestionSaveDto questionSaveDto) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + id + " not found")
        );

        if (quiz.getStatus() != QuizStatus.UNPUBLISHED) {
            throw new IllegalStateException("Quiz is already published or finished");
        }

        Question question = questionMapper.toEntity(questionSaveDto);
        question.setQuiz(quiz);

        int index = questionRepository.countByQuizId(id) + 1;
        question.setIndex(index);

        return questionMapper.toDto(questionRepository.save(question));
    }

    @Override
    public PagingResponseDto getAllByQuizId(long quizId, QuestionFilterDto questionFilterDto) {
        if (quizRepository.findById(quizId).isEmpty()) {
            throw new NotFoundException("Quiz by id: " + quizId + " not found");
        }

        JPAQuery<Question> query = new JPAQuery<>(entityManager);
        QQuestion qQuestion = QQuestion.question;
        query.from(qQuestion);
        query.where(qQuestion.quiz.id.eq(quizId));

        if (StringUtils.isNoneBlank(questionFilterDto.getBody())) {
            query.where(qQuestion.body.toLowerCase().contains(questionFilterDto.getBody().toLowerCase()));
        }
        if (questionFilterDto.getType() != null) {
            query.where(qQuestion.type.eq(questionFilterDto.getType()));
        }

        long total = query.fetchCount();

        query.offset((long) questionFilterDto.getPage() * questionFilterDto.getSize());
        query.limit(questionFilterDto.getSize());

        String orderBy = switch (questionFilterDto.getOrderBy()) {
            case ID -> "id";
            case INDEX -> "index";
            case POINTS -> "points";
        };

        PathBuilder<Object> expression = new PathBuilder<>(Question.class, "question");
        PathBuilder<Object> fieldPath = expression.get(orderBy);
        OrderSpecifier orderSpecifier = new OrderSpecifier(
                questionFilterDto.getOrderDirection(), fieldPath
        );
        query.orderBy(orderSpecifier);

        List<QuestionResponseDto> dtos = questionMapper.toDtos(query.fetch());
        for (QuestionResponseDto dto : dtos) {
            dto.setOptionCount(optionRepository.countByQuestionId((dto.getId())));
        }

        return PagingResponseDto.builder()
                .data(dtos)
                .total(total)
                .page(questionFilterDto.getPage())
                .size(questionFilterDto.getSize())
                .build();
    }

    @Override
    public List<QuestionResponseDto> getAllPublishedByQuizId(long id) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Quiz by id: " + id + " not found")
        );

        if (quiz.getStatus() != QuizStatus.PUBLISHED) {
            throw new NotFoundException("Quiz by id: " + id + " not found");
        }


        List<QuestionResponseDto> dtos = questionMapper.toDtos(questionRepository.findAllByQuizId(id));
        for (QuestionResponseDto dto : dtos) {
            dto.setOptions(optionMapper.toPublishedDtos(optionRepository.findAllByQuestionId(dto.getId())));
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public QuizStatsResponseDto getStats() {
        return QuizStatsResponseDto.builder()
                .total(quizRepository.count())
                .published(quizRepository.countByStatus(QuizStatus.PUBLISHED))
                .drafts(quizRepository.countByStatus(QuizStatus.UNPUBLISHED))
                .attempts(attemptRepository.count())
                .build();
    }

    @Override
    public QuestionResponseDto getByQuizId(long quizId, long questionId) {
        if (quizRepository.findById(quizId).isEmpty()) {
            throw new NotFoundException("Quiz by id: " + quizId + " not found");
        }

        Question question = questionRepository.findById(questionId).orElseThrow(() ->
                new NotFoundException("Question by id: " + questionId + " not found")
        );

        if (question.getQuiz().getId() != quizId) {
            throw new IllegalArgumentException("Invalid quiz or question id");
        }

        return questionMapper.toDto(question);
    }
}
