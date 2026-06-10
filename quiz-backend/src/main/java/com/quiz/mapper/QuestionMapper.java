package com.quiz.mapper;

import com.quiz.dto.question.QuestionResponseDto;
import com.quiz.dto.question.QuestionSaveDto;
import com.quiz.entity.Question;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuestionMapper {
    Question toEntity(QuestionSaveDto questionSaveDto);

    QuestionResponseDto toDto(Question question);

    List<QuestionResponseDto> toDtos(List<Question> questions);
}
