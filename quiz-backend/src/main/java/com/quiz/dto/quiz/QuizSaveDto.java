package com.quiz.dto.quiz;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizSaveDto {
    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 150, message = "Title must contain from 2 to 150 characters")
    private String title;

    @Size(min = 10, max = 300, message = "Description must contain from 10 to 300 characters")
    private String description;
}
