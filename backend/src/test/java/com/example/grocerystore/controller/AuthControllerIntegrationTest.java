package com.example.grocerystore.controller;

import com.example.grocerystore.dto.LoginRequest;
import com.example.grocerystore.dto.RegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureTestMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for AuthController.
 */
@SpringBootTest
@AutoConfigureTestMvc
@ActiveProfiles("test")
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void register_WithValidData_ShouldReturnSuccess() throws Exception {
        // Given
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setAddress("123 Test Street");
        request.setContactNumber("1234567890");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("User registered successfully"));
    }

    @Test
    void register_WithDuplicateEmail_ShouldReturnBadRequest() throws Exception {
        // Given - First registration
        RegisterRequest request1 = new RegisterRequest();
        request1.setName("Test User 1");
        request1.setEmail("duplicate@example.com");
        request1.setPassword("password123");
        request1.setAddress("123 Test Street");
        request1.setContactNumber("1234567890");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isOk());

        // Given - Second registration with same email
        RegisterRequest request2 = new RegisterRequest();
        request2.setName("Test User 2");
        request2.setEmail("duplicate@example.com");
        request2.setPassword("password456");
        request2.setAddress("456 Test Avenue");
        request2.setContactNumber("0987654321");

        // When & Then
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Registration failed")));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() throws Exception {
        // Given - Register a user first
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Login Test User");
        registerRequest.setEmail("login@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setAddress("123 Login Street");
        registerRequest.setContactNumber("1234567890");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Given - Login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("login@example.com");
        loginRequest.setPassword("password123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.email").value("login@example.com"))
                .andExpect(jsonPath("$.name").value("Login Test User"))
                .andExpect(jsonPath("$.role").value("ROLE_USER"));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturnBadRequest() throws Exception {
        // Given
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("nonexistent@example.com");
        loginRequest.setPassword("wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Login failed: Invalid credentials"));
    }

    @Test
    void login_WithAdminCredentials_ShouldReturnAdminRole() throws Exception {
        // Given - Admin credentials (from DataInitializer)
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("admin@grocery.com");
        loginRequest.setPassword("admin123");

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpected(jsonPath("$.email").value("admin@grocery.com"))
                .andExpect(jsonPath("$.name").value("Administrator"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }
}
