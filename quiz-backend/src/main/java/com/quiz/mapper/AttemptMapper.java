package com.quiz.mapper;

import com.quiz.dto.attempt.AttemptResponseDto;
import com.quiz.entity.Attempt;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AttemptMapper {
    AttemptResponseDto toDto(Attempt attempt);

    List<AttemptResponseDto> toDtos(List<Attempt> attempts);
}
