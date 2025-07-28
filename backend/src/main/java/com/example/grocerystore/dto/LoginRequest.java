package com.example.grocerystore.dto;

import lombok.Data;

/**
 * DTO for login requests.
 */
@Data
public class LoginRequest {
    private String email;
    private String password;
}
