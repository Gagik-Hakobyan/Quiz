package com.quiz.dto.quiz;

import com.querydsl.core.types.Order;
import com.quiz.enums.QuizOrderType;
import com.quiz.enums.QuizStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizFilterDto {
    @Min(value = 0, message = "Page can not be negative")
    private int page = 0;

    @Min(value = 5, message = "Size must be at least 5")
    @Max(value = 20, message = "Size must not exceed 20")
    private int size = 5;

    private QuizOrderType orderBy = QuizOrderType.ID;
    private Order orderDirection = Order.ASC;

    @Size(max = 150, message = "Title must contain to 150 characters")
    private String title;

    private QuizStatus status;

    private LocalDateTime createdFrom;
    private LocalDateTime createdTo;
}
