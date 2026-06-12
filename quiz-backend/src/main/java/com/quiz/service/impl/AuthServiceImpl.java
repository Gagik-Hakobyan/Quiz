package com.quiz.service.impl;

import com.quiz.dto.auth.AuthRequestDto;
import com.quiz.dto.auth.AuthResponseDto;
import com.quiz.dto.user.UserResponseDto;
import com.quiz.dto.user.UserSaveDto;
import com.quiz.entity.User;
import com.quiz.exception.AlreadyExistsException;
import com.quiz.mapper.UserMapper;
import com.quiz.repository.UserRepository;
import com.quiz.service.AuthService;
import com.quiz.util.GenerateUtil;
import com.quiz.util.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil tokenUtil;
    private final GenerateUtil generateUtil;
    private final UserRepository userRepository;
    private final MailService mailService;
    private final UserMapper userMapper;

    private static final int VERIFY_TOKEN_LENGTH = 6;
    private static final String VERIFICATION_SUBJECT = "Account Verification";
    private static final String VERIFICATION_TEMPLATE =
            "Dear %s welcome, you have successfully registered to our website, your verification code is %s";

    @Override
    public void verify(String token) {
        Optional<User> userByVerifyToken = userRepository.findByVerifyToken(token);

        if (userByVerifyToken.isEmpty()) {
            throw new IllegalArgumentException("Invalid verification token");
        }

        User user = userByVerifyToken.get();
        user.setEnabled(true);
        user.setVerifyToken(null);
        userRepository.save(user);
    }

    @Override
    public UserResponseDto register(UserSaveDto userSaveDto) {
        if (userRepository.findByEmail(userSaveDto.getEmail()).isPresent()) {
            throw new AlreadyExistsException("User by email: " + userSaveDto.getEmail() + " already exists");
        }

        User user = userMapper.toEntity(userSaveDto);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setVerifyToken(generateUtil.generate(VERIFY_TOKEN_LENGTH));
        userRepository.save(user);

        mailService.sendVerificationMail(
                user.getEmail(),
                VERIFICATION_SUBJECT,
                String.format(VERIFICATION_TEMPLATE, user.getName(), user.getVerifyToken()));

        return userMapper.toDto(user);
    }

    @Override
    public AuthResponseDto login(AuthRequestDto authRequestDto) {
        User user = userRepository.findByEmail(authRequestDto.getEmail()).orElseThrow(() ->
                new IllegalArgumentException("Invalid email or password")
        );

        if (!passwordEncoder.matches(authRequestDto.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("User is not verified");
        }

        return AuthResponseDto.builder()
                .token(tokenUtil.generateToken(user.getEmail()))
                .userResponseDto(userMapper.toDto(user))
                .build();
    }
}
