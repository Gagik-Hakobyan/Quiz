package com.quiz.service;

import com.quiz.dto.auth.AuthRequestDto;
import com.quiz.dto.auth.AuthResponseDto;
import com.quiz.dto.user.UserResponseDto;
import com.quiz.dto.user.UserSaveDto;

public interface AuthService {
    UserResponseDto register(UserSaveDto userSaveDto);

    void verify(String token);

    AuthResponseDto login(AuthRequestDto authRequestDto);
}
