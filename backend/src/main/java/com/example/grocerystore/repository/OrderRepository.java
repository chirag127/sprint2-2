package com.example.grocerystore.repository;

import com.example.grocerystore.model.Order;
import com.example.grocerystore.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Order entity operations.
 */
@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders for a specific user, ordered by date descending.
     */
    List<Order> findByUserOrderByOrderDateDesc(User user);
}
