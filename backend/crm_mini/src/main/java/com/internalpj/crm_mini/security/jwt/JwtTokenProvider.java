package com.internalpj.crm_mini.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.time.Instant;

@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // Generate token
    public String generateAccessToken(Long userId, String email) {
        Instant now = Instant.now();
        Instant expiryInstant = now.plusMillis(expiration);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiryInstant))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Generate refresh token
    public String generateRefreshToken(Long userId) {
        Instant now = Instant.now();
        Instant expiryInstant = now.plusMillis(refreshExpiration);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("type", "refresh")
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(expiryInstant))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Get userId from token
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}
