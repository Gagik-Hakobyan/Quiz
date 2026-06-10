package com.quiz.dto.answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnswerResponseDto {
    private Long id;
    private String questionBody;
    private int questionPoints;
    private String textAnswer;
    private int earnedPoints;
}
