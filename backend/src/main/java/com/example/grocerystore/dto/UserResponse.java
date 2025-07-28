package com.example.grocerystore.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO for user responses (without password).
 */
@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String contactNumber;
}
