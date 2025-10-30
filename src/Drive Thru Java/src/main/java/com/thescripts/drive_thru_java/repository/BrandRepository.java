package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
}
