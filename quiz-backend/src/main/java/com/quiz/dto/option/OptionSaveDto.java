package com.quiz.dto.option;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptionSaveDto {
    @Size(min = 1, max = 300, message = "Option must contain from 1 to 300 characters")
    private String body;

    @NotNull(message = "isCorrect is required")
    private boolean isCorrect;
}
