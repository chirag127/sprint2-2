package com.example.grocerystore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for authentication responses.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String role;
}
