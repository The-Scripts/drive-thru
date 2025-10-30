package com.thescripts.drive_thru_java.service;

import com.thescripts.drive_thru_java.entity.Brand;
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

    public List<Product> findAllProducts() {
        return (List<Product>) productRepository.findAll();
    }

    public  List<Product> findByCategory(Category category) {
        return productRepository.findProductsByCategory(category);
    }

    public List<Product> findByBrandId(Long brandId) {
        return productRepository.findProductsByBrandId(brandId);
    }

    public List<Product> findByShopId(Long shopId) {
        return productRepository.findProductsByShopId(shopId);
    }
}
