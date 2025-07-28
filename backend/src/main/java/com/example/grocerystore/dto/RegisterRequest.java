package com.example.grocerystore.dto;

import lombok.Data;

/**
 * DTO for user registration requests.
 */
@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String address;
    private String contactNumber;
}
