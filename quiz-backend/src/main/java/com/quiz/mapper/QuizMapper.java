package com.quiz.mapper;

import com.quiz.dto.quiz.QuizResponseDto;
import com.quiz.dto.quiz.QuizSaveDto;
import com.quiz.entity.Quiz;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuizMapper {
    QuizResponseDto toDto(Quiz quiz);

    List<QuizResponseDto> toDtos(List<Quiz> quizzes);

    Quiz toEntity(QuizSaveDto quizSaveDto);

}
