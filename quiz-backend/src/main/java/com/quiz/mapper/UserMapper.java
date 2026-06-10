package com.quiz.mapper;

import com.quiz.dto.user.UserResponseDto;
import com.quiz.dto.user.UserSaveDto;
import com.quiz.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserSaveDto userSaveDto);

    UserResponseDto toDto(User user);
}
