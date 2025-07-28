package com.example.grocerystore.controller;

import com.example.grocerystore.dto.OrderRequest;
import com.example.grocerystore.model.Order;
import com.example.grocerystore.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for order-related endpoints.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('USER')")
public class OrderController {

    private final OrderService orderService;

    /**
     * Place a new order.
     */
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            Order order = orderService.createOrder(orderRequest, userEmail);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to place order: " + e.getMessage());
        }
    }

    /**
     * Get order history for the authenticated user.
     */
    @GetMapping("/my-history")
    public ResponseEntity<List<Order>> getOrderHistory() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userEmail = authentication.getName();
        
        List<Order> orders = orderService.getOrderHistory(userEmail);
        return ResponseEntity.ok(orders);
    }

    /**
     * Get order by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            
            // Ensure user can only access their own orders
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String userEmail = authentication.getName();
            
            if (!order.getUser().getEmail().equals(userEmail)) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to get order: " + e.getMessage());
        }
    }
}
