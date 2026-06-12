package com.quiz.service.impl;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class MailServiceTest {
    @Mock
    private JavaMailSender mailSender;

    @InjectMocks
    private MailService mailService;

    @Test
    void sendVerificationMail_ShouldSendEmail() {
        String to = "test@gmail.com";
        String subject = "Account Verification";
        String message = "Your code is 123456";

        mailService.sendVerificationMail(to, subject, message);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }
}