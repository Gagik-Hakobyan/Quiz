package com.quiz.dto.attempt;

import com.quiz.enums.AttemptStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttemptResponseDto {
    private long id;
    private int maxPoints;
    private int currentPoints;
    private AttemptStatus status;
    private LocalDateTime startedDate;
}
