package com.example.grocerystore.config;

import com.example.grocerystore.model.Product;
import com.example.grocerystore.model.Role;
import com.example.grocerystore.model.User;
import com.example.grocerystore.repository.ProductRepository;
import com.example.grocerystore.repository.RoleRepository;
import com.example.grocerystore.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

/**
 * Component to initialize default data on application startup.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create roles if they don't exist
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            roleRepository.save(new Role("ROLE_USER"));
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        // Create admin user if it doesn't exist
        if (userRepository.findByEmail("admin@grocery.com").isEmpty()) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail("admin@grocery.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setAddress("Admin Address");
            admin.setContactNumber("1234567890");

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").get();
            Role userRole = roleRepository.findByName("ROLE_USER").get();

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            roles.add(userRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }

        // Create sample products if none exist
        if (productRepository.count() == 0) {
            productRepository.save(new Product(null, "Apples", 2.99, 100));
            productRepository.save(new Product(null, "Bananas", 1.99, 150));
            productRepository.save(new Product(null, "Bread", 3.49, 50));
            productRepository.save(new Product(null, "Milk", 4.99, 75));
            productRepository.save(new Product(null, "Eggs", 5.99, 60));
            productRepository.save(new Product(null, "Chicken Breast", 12.99, 30));
            productRepository.save(new Product(null, "Rice", 8.99, 40));
            productRepository.save(new Product(null, "Pasta", 2.49, 80));
            productRepository.save(new Product(null, "Tomatoes", 3.99, 90));
            productRepository.save(new Product(null, "Onions", 2.79, 70));
        }
    }
}
