package com.quiz.service.impl;

import com.quiz.entity.User;
import com.quiz.exception.NotFoundException;
import com.quiz.repository.UserRepository;
import com.quiz.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() ->
                new NotFoundException("User by email: " + email + " not found")
        );
    }

    @Override
    public User save(User user) {
        return userRepository.save(user);
    }
}
