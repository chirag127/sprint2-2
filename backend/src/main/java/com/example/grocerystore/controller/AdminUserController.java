package com.example.grocerystore.controller;

import com.example.grocerystore.dto.UserResponse;
import com.example.grocerystore.model.User;
import com.example.grocerystore.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for admin user management endpoints.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    /**
     * Search users by name.
     */
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String name) {
        List<User> users = userService.searchUsersByName(name);
        
        // Convert to DTO to hide password
        List<UserResponse> userResponses = users.stream()
                .map(user -> new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getAddress(),
                    user.getContactNumber()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userResponses);
    }
}
