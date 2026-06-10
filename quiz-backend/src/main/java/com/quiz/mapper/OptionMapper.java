package com.quiz.mapper;

import com.quiz.dto.option.OptionAdminResponseDto;
import com.quiz.dto.option.OptionResponseDto;
import com.quiz.dto.option.OptionSaveDto;
import com.quiz.entity.Option;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OptionMapper {
    Option toEntity(OptionSaveDto optionSaveDto);

    OptionAdminResponseDto toDto(Option option);

    List<OptionAdminResponseDto> toDtos(List<Option> options);

    List<OptionResponseDto> toPublishedDtos(List<Option> options);

}
