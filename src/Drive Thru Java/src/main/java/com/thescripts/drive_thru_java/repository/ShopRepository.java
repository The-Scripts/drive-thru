package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.Shop;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRepository extends CrudRepository<Shop, Long> {
}
