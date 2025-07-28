package com.example.grocerystore.service;

import com.example.grocerystore.model.Product;
import com.example.grocerystore.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProductService.
 */
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

    private Product testProduct;

    @BeforeEach
    void setUp() {
        testProduct = new Product();
        testProduct.setId(1L);
        testProduct.setName("Test Product");
        testProduct.setPrice(9.99);
        testProduct.setQuantity(100);
    }

    @Test
    void getAllProducts_ShouldReturnAllProducts() {
        // Given
        List<Product> expectedProducts = Arrays.asList(testProduct);
        when(productRepository.findAll()).thenReturn(expectedProducts);

        // When
        List<Product> actualProducts = productService.getAllProducts();

        // Then
        assertEquals(expectedProducts, actualProducts);
        verify(productRepository).findAll();
    }

    @Test
    void getProductById_WhenProductExists_ShouldReturnProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        Product actualProduct = productService.getProductById(1L);

        // Then
        assertEquals(testProduct, actualProduct);
        verify(productRepository).findById(1L);
    }

    @Test
    void getProductById_WhenProductNotExists_ShouldThrowException() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.getProductById(1L));
        
        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(1L);
    }

    @Test
    void searchProductsByName_ShouldReturnMatchingProducts() {
        // Given
        String searchTerm = "test";
        List<Product> expectedProducts = Arrays.asList(testProduct);
        when(productRepository.findByNameContainingIgnoreCase(searchTerm))
            .thenReturn(expectedProducts);

        // When
        List<Product> actualProducts = productService.searchProductsByName(searchTerm);

        // Then
        assertEquals(expectedProducts, actualProducts);
        verify(productRepository).findByNameContainingIgnoreCase(searchTerm);
    }

    @Test
    void createProduct_ShouldSaveAndReturnProduct() {
        // Given
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        Product actualProduct = productService.createProduct(testProduct);

        // Then
        assertEquals(testProduct, actualProduct);
        verify(productRepository).save(testProduct);
    }

    @Test
    void updateProduct_WhenProductExists_ShouldUpdateAndReturnProduct() {
        // Given
        Product updatedProduct = new Product();
        updatedProduct.setName("Updated Product");
        updatedProduct.setPrice(19.99);
        updatedProduct.setQuantity(50);

        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));
        when(productRepository.save(any(Product.class))).thenReturn(testProduct);

        // When
        Product actualProduct = productService.updateProduct(1L, updatedProduct);

        // Then
        assertEquals("Updated Product", actualProduct.getName());
        assertEquals(19.99, actualProduct.getPrice());
        assertEquals(50, actualProduct.getQuantity());
        verify(productRepository).findById(1L);
        verify(productRepository).save(testProduct);
    }

    @Test
    void deleteProduct_WhenProductExists_ShouldDeleteProduct() {
        // Given
        when(productRepository.findById(1L)).thenReturn(Optional.of(testProduct));

        // When
        productService.deleteProduct(1L);

        // Then
        verify(productRepository).findById(1L);
        verify(productRepository).delete(testProduct);
    }

    @Test
    void deleteProduct_WhenProductNotExists_ShouldThrowException() {
        // Given
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> productService.deleteProduct(1L));
        
        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository).findById(1L);
        verify(productRepository, never()).delete(any(Product.class));
    }
}
