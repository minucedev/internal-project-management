package com.internalpj.crm_mini.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.internalpj.crm_mini.entity.RefreshToken;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    // Find refresh token by token string
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

    // Find active (not revoked) refresh token by user ID
    RefreshToken findByUser_IdAndRevokedFalse(Long userId);    
}
