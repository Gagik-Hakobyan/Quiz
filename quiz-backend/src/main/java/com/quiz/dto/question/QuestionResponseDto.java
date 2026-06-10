package com.quiz.dto.question;

import com.quiz.dto.option.OptionResponseDto;
import com.quiz.entity.Quiz;
import com.quiz.enums.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponseDto {
    private long id;
    private String body;
    private QuestionType type;
    private int index;
    private int points;
    private int optionCount;
    private Quiz quiz;
    private List<OptionResponseDto> options;
}
