package com.thescripts.drive_thru_java.repository;

import com.thescripts.drive_thru_java.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
