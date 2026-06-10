package com.quiz.mapper;

import com.quiz.dto.answer.AnswerResponseDto;
import com.quiz.entity.Answer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnswerMapper {
    @Mapping(target = "questionBody", source = "question.body")
    @Mapping(target = "questionPoints", source = "question.points")
    @Mapping(target = "earnedPoints", source = "earnedPoints")
    AnswerResponseDto toDto(Answer answer);
}
