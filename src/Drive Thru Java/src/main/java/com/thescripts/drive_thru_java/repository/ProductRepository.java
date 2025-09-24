package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.Category;
import com.thescripts.drive_thru_java.entity.Product;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends CrudRepository<Product, Long> {
    List<Product> findProductEntitiesByCategory(Category category);;
}
