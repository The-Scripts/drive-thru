package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.Category;
import com.thescripts.drive_thru_java.entity.Product;
import com.thescripts.drive_thru_java.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findProductsByCategory(Category category);
    List<Product> findProductsByBrandId(Long brandId);
    List<Product> findProductsByShopId(Long shopId);
}
