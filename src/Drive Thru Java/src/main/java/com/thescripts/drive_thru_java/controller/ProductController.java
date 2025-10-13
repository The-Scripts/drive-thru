package com.thescripts.drive_thru_java.controller;

import com.thescripts.drive_thru_java.entity.Brand;
import com.thescripts.drive_thru_java.entity.Product;
import com.thescripts.drive_thru_java.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://react:3000"})
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> findAll() {
        return this.productService.findAllProducts();
    }

    @GetMapping("/by-brand/{brandId}")
    public ResponseEntity<List<Product>> findByBrandId(@PathVariable Long brandId) {
        List<Product> products = productService.findByBrandId(brandId);
        if (products.isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/by-shop/{shopId}")
    public ResponseEntity<List<Product>> findByShopId(@PathVariable Long shopId) {
        List<Product> products = productService.findByShopId(shopId);
        if (products.isEmpty())
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(products);
    }
}
