package com.quiz.service;

import com.quiz.entity.User;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public interface UserService {
    User getByEmail(String email);

    User save(User user);
}
