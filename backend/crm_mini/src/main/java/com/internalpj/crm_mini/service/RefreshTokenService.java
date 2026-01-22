package com.internalpj.crm_mini.service;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.internalpj.crm_mini.entity.RefreshToken;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.exception.UserNotFoundException;
import com.internalpj.crm_mini.exception.InvalidTokenException;
import com.internalpj.crm_mini.exception.RefreshTokenNotFoundException;
import com.internalpj.crm_mini.repository.RefreshTokenRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import com.internalpj.crm_mini.security.jwt.JwtTokenProvider;

@Service
public class RefreshTokenService {
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public RefreshTokenService(JwtTokenProvider jwtTokenProvider, RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public String createRefreshToken(Long userId) {
        // Get user from DB
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException());

        // Generate refresh token string
        String refreshTokenString = jwtTokenProvider.generateRefreshToken(userId);

        // Calculate expiry date
        Instant expiryDate = Instant.now().plusMillis(refreshExpiration);

        // Create RefreshToken entity
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setRefreshToken(refreshTokenString);
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setExpiryDate(expiryDate);
        refreshTokenEntity.setRevoked(false);

        // Save to DB
        refreshTokenRepository.save(refreshTokenEntity);

        // Return token string
        return refreshTokenString;
    }

    // Revoke token when logout/banned
    public void revokeRefreshToken(String refreshToken) {
        RefreshToken refreshTokenEntity = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RefreshTokenNotFoundException());
        refreshTokenEntity.setRevoked(true);
        refreshTokenRepository.save(refreshTokenEntity);
    }

    public String refreshAccessToken(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new InvalidTokenException();
        }

        RefreshToken refreshTokenEntity = refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RefreshTokenNotFoundException());

        if (refreshTokenEntity.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked.");
        }

        if (refreshTokenEntity.getExpiryDate().isBefore(Instant.now())) {
            throw new InvalidTokenException("Refresh token has expired.");
        }

        User user = refreshTokenEntity.getUser();
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());

        //Update expiry date of refresh token
        Instant expiryDate = Instant.now().plusMillis(refreshExpiration);
        refreshTokenEntity.setExpiryDate(expiryDate);
        refreshTokenRepository.save(refreshTokenEntity);

        return newAccessToken;
    }
}
