package com.quiz.service;

import com.quiz.dto.option.OptionAdminResponseDto;
import com.quiz.dto.option.OptionSaveDto;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.jspecify.annotations.Nullable;

import java.util.List;

public interface OptionService {
    OptionAdminResponseDto create(long quizId, long questionId, OptionSaveDto optionSaveDto);

    List<OptionAdminResponseDto> getAllByQuestionId(long quizId, long questionId);
}
