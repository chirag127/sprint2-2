package com.example.grocerystore.repository;

import com.example.grocerystore.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for Product entity operations.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    /**
     * Search products by name (case-insensitive, partial match).
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("name") String name);
}
