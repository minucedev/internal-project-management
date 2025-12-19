package com.internalpj.crm_mini.repository;

import com.internalpj.crm_mini.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.username = ?1 AND u.deletedAt IS NULL")
    boolean existsByUsername(String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u WHERE u.email = ?1 AND u.deletedAt IS NULL")
    boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.username = ?1 AND u.deletedAt IS NULL")
    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.id = ?1 AND u.deletedAt IS NULL")
    Optional<User> findById(Long id);

}
