package com.quiz.dto.answer;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerSaveDto {
    @NotNull(message = "Question id is required")
    @Min(value = 0, message = "Question id can not be negative")
    private Long questionId;

    private List<Long> optionIds;

    @Size(min = 1, max = 500, message = "Answer is required")
    private String textAnswer;
}
