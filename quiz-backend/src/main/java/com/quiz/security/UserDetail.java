package com.quiz.security;


import com.quiz.entity.User;
import lombok.Getter;
import org.springframework.security.core.authority.AuthorityUtils;

@Getter
public class UserDetail extends org.springframework.security.core.userdetails.User {
    private final User user;

    public UserDetail(User user) {
        super(user.getEmail(), user.getPassword(), user.isEnabled(),
                true, true, true,
                AuthorityUtils.createAuthorityList(user.getRole().name()));
        this.user = user;
    }
}
