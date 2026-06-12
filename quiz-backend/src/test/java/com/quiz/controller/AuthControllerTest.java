package com.quiz.controller;

import com.quiz.dto.user.UserSaveDto;
import com.quiz.entity.User;
import com.quiz.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Test
    void verify_ShouldVerify() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        mockMvc.perform(post("/verify")
                        .contentType(MediaType.APPLICATION_JSON)
                        .param("token", user.getVerifyToken()))
                .andExpect(status().isOk());
    }

    @Test
    void verify_ShouldThrowException_WhenTokenIsBlank() throws Exception {
        mockMvc.perform(post("/verify")
                        .param("token", ""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void verify_ShouldThrowException_WhenTokenIsNull() throws Exception {
        mockMvc.perform(post("/verify"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_ShouldRegister() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }

    @Test
    void register_ShouldThrowException_WhenDuplicateMail() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(request.getEmail()));

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    void register_ShouldThrowException_WhenMailIsInvalid() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("John");
        request.setEmail("not-valid-mail");
        request.setPassword("password123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_ShouldThrowException_WhenNameIsBlank() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("");
        request.setEmail("john@example.com");
        request.setPassword("password123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_ShouldThrowException_WhenPasswordIsShort() throws Exception {
        UserSaveDto request = new UserSaveDto();
        request.setName("John");
        request.setEmail("john@example.com");
        request.setPassword("123");

        mockMvc.perform(post("/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}