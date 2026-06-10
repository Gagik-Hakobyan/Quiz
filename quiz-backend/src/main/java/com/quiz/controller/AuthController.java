package com.quiz.controller;

import com.quiz.dto.auth.AuthRequestDto;
import com.quiz.dto.auth.AuthResponseDto;
import com.quiz.dto.user.UserResponseDto;
import com.quiz.dto.user.UserSaveDto;
import com.quiz.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Validated
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@RequestBody @Valid UserSaveDto userSaveDto) {
        return ResponseEntity.ok(authService.register(userSaveDto));
    }

    @PostMapping("/verify")
    public ResponseEntity<Void> verify(
            @RequestParam("token")
            @NotBlank(message = "Token is required")
            @Size(min = 6, max = 6, message = "Invalid token length")
            String token
    ) {
        authService.verify(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@RequestBody @Valid AuthRequestDto authRequestDto) {
        return ResponseEntity.ok(authService.login(authRequestDto));
    }
}
