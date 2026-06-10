package com.quiz.dto.option;

import com.quiz.entity.Question;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OptionAdminResponseDto {
    private Long id;
    private String body;
    private boolean isCorrect;
    private Question question;
}
