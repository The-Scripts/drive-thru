package com.thescripts.drive_thru_java.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Brand extends JpaRepository<Brand, Long> {
}
