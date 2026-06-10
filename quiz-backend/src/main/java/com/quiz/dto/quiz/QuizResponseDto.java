package com.quiz.dto.quiz;

import com.quiz.entity.User;
import com.quiz.enums.QuizStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResponseDto {
    private long id;
    private String title;
    private String description;
    private QuizStatus status;
    private User createdBy;
    private int questionCount;
    private int maxPoints;
    private LocalDateTime createdDate;
}
