package com.quiz.dto.question;

import com.quiz.enums.QuestionType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionSaveDto {
    @NotBlank(message = "Question is required")
    @Size(min = 5, max = 500, message = "Question must contain from 10 to 500 characters")
    private String body;

    @NotNull(message = "Question Type is required")
    private QuestionType type;

    @Min(value = 1, message = "Points must be at least 1")
    @Max(value = 100, message = "Points must not exceed 100")
    private int points;
}
