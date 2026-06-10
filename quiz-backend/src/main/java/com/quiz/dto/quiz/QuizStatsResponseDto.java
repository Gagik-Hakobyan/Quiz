package com.quiz.dto.quiz;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class QuizStatsResponseDto {
    private long total;
    private long published;
    private long drafts;
    private long attempts;
}
