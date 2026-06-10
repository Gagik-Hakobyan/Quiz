package com.quiz.dto.answer;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerGradeRequestDto {
    @NotNull(message = "Earned points is required")
    @Min(value = 0, message = "Earned points can not be negative")
    private int earnedPoints;
}
