package com.quiz.service.impl;

import com.quiz.dto.auth.AuthRequestDto;
import com.quiz.dto.auth.AuthResponseDto;
import com.quiz.dto.user.UserResponseDto;
import com.quiz.dto.user.UserSaveDto;
import com.quiz.entity.User;
import com.quiz.exception.AlreadyExistsException;
import com.quiz.mapper.UserMapper;
import com.quiz.repository.UserRepository;
import com.quiz.util.GenerateUtil;
import com.quiz.util.JwtTokenUtil;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private GenerateUtil generateUtil;

    @Mock
    private MailService mailService;

    @Mock
    private JwtTokenUtil tokenUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    void login_ShouldThrowException_WhenEmailIsInvalid() {
        AuthRequestDto authRequestDto = new AuthRequestDto();
        authRequestDto.setEmail("test@mail.com");

        when(userRepository.findByEmail(authRequestDto.getEmail())).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.login(authRequestDto));
    }

    @Test
    void login_ShouldThrowException_WhenPasswordsIsNotMatch() {
        AuthRequestDto authRequestDto = new AuthRequestDto();
        authRequestDto.setEmail("test@mail.com");
        authRequestDto.setPassword("password");

        User user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encodedPassword");

        when(userRepository.findByEmail(authRequestDto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequestDto.getPassword(), user.getPassword())).thenReturn(false);

        assertThrows(IllegalArgumentException.class, () -> authService.login(authRequestDto));
    }

    @Test
    void login_ShouldThrowException_WhenUserIsNotEnabled() {
        AuthRequestDto authRequestDto = new AuthRequestDto();
        authRequestDto.setEmail("test@mail.com");
        authRequestDto.setPassword("password");

        User user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encodedPassword");
        user.setEnabled(false);

        when(userRepository.findByEmail(authRequestDto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequestDto.getPassword(), user.getPassword())).thenReturn(true);

        assertThrows(IllegalStateException.class, () -> authService.login(authRequestDto));
    }

    @Test
    void login_ShouldLogin() {
        AuthRequestDto authRequestDto = new AuthRequestDto();
        authRequestDto.setEmail("test@mail.com");
        authRequestDto.setPassword("password");

        User user = new User();
        user.setEmail("test@mail.com");
        user.setPassword("encodedPassword");
        user.setEnabled(true);

        UserResponseDto userResponseDto = new UserResponseDto();
        String token = "token";

        AuthResponseDto authResponseDto = new AuthResponseDto();
        authResponseDto.setToken(token);
        authResponseDto.setUserResponseDto(userResponseDto);

        when(userRepository.findByEmail(authRequestDto.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(authRequestDto.getPassword(), user.getPassword())).thenReturn(true);
        when(tokenUtil.generateToken(user.getEmail())).thenReturn(token);
        when(userMapper.toDto(user)).thenReturn(userResponseDto);

        AuthResponseDto result = authService.login(authRequestDto);

        assertEquals(authResponseDto, result);
    }

    @Test
    void register_ShouldThrowException_WhenUserAlreadyExists() {
        UserSaveDto userSaveDto = new UserSaveDto();
        userSaveDto.setEmail("test@mail.com");

        when(userRepository.findByEmail(userSaveDto.getEmail())).thenReturn(Optional.of(new User()));

        assertThrows(AlreadyExistsException.class, () -> authService.register(userSaveDto));
    }

    @Test
    void register_ShouldRegister() {
        UserSaveDto userSaveDto = new UserSaveDto();
        userSaveDto.setEmail("test@mail.com");
        userSaveDto.setName("test");
        userSaveDto.setPassword("password");

        User user = new User();
        user.setEmail("test@mail.com");
        user.setName("test");
        user.setPassword("password");

        UserResponseDto userResponseDto = new UserResponseDto();
        userResponseDto.setEmail("test@mail.com");

        when(userRepository.findByEmail(userSaveDto.getEmail())).thenReturn(Optional.empty());
        when(userMapper.toEntity(userSaveDto)).thenReturn(user);
        when(passwordEncoder.encode(user.getPassword())).thenReturn("encodedPassword");
        when(generateUtil.generate(6)).thenReturn("123456");
        when(userMapper.toDto(user)).thenReturn(userResponseDto);

        UserResponseDto result = authService.register(userSaveDto);

        assertEquals(userResponseDto, result);
        verify(userRepository).save(user);
        verify(mailService).sendVerificationMail(eq(user.getEmail()), any(), any());
    }

    @Test
    void verify_ShouldVerify() {
        String token = "123546";
        User user = new User();
        user.setEnabled(false);
        user.setVerifyToken(token);

        when(userRepository.findByVerifyToken(token)).thenReturn(Optional.of(user));

        authService.verify(token);

        assertTrue(user.isEnabled());
        assertNull(user.getVerifyToken());
        verify(userRepository).save(user);
    }

    @Test
    void verify_ShouldThrowException_WhenTokenIsInvalid() {
        String token = "token";

        when(userRepository.findByVerifyToken(token)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> authService.verify(token));
    }
}