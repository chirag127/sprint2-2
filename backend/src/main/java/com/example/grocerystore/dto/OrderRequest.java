package com.example.grocerystore.dto;

import lombok.Data;

import java.util.List;

/**
 * DTO for order creation requests.
 */
@Data
public class OrderRequest {
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
