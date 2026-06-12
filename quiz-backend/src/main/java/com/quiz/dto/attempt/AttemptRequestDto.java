package com.quiz.dto.attempt;

import com.quiz.dto.answer.AnswerSaveDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttemptRequestDto {
    private List<@Valid AnswerSaveDto> answers;
}
