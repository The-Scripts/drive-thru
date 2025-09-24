package com.thescripts.drive_thru_java.service;

import com.thescripts.drive_thru_java.entity.Category;
import com.thescripts.drive_thru_java.entity.Product;
import com.thescripts.drive_thru_java.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public  List<Product> findByCategory(Category category) {
        return productRepository.findProductEntitiesByCategory(category);
    }

}
