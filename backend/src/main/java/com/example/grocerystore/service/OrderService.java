package com.example.grocerystore.service;

import com.example.grocerystore.dto.OrderRequest;
import com.example.grocerystore.model.Order;
import com.example.grocerystore.model.OrderItem;
import com.example.grocerystore.model.Product;
import com.example.grocerystore.model.User;
import com.example.grocerystore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Service class for order-related operations.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final UserService userService;

    /**
     * Create a new order for a user.
     */
    public Order createOrder(OrderRequest orderRequest, String userEmail) {
        User user = userService.findByEmail(userEmail);
        
        Order order = new Order();
        order.setUser(user);
        
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;
        
        for (OrderRequest.OrderItemRequest itemRequest : orderRequest.getItems()) {
            Product product = productService.getProductById(itemRequest.getProductId());
            
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            
            orderItems.add(orderItem);
            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }
        
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        
        return orderRepository.save(order);
    }

    /**
     * Get order history for a user.
     */
    public List<Order> getOrderHistory(String userEmail) {
        User user = userService.findByEmail(userEmail);
        return orderRepository.findByUserOrderByOrderDateDesc(user);
    }

    /**
     * Get order by ID.
     */
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
}
