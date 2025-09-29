package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Long> {
}
