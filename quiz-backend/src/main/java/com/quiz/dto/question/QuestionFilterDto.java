package com.quiz.dto.question;

import com.querydsl.core.types.Order;
import com.quiz.enums.QuestionOrderType;
import com.quiz.enums.QuestionType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionFilterDto {
    @Min(value = 0, message = "Page can not be negative")
    private int page = 0;

    @Min(value = 5, message = "Size must be at least 5")
    @Max(value = 20, message = "Size must not exceed 20")
    private int size = 5;

    private QuestionOrderType orderBy = QuestionOrderType.ID;
    private Order orderDirection = Order.ASC;

    @Size(max = 500, message = "Question must contain from 10 to 500 characters")
    private String body;

    private QuestionType type;
}
