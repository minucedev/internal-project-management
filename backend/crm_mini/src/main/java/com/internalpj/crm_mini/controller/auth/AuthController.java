package com.internalpj.crm_mini.controller.auth;

import com.internalpj.crm_mini.common.ApiResponse;
import com.internalpj.crm_mini.dto.request.LoginRequest;
import com.internalpj.crm_mini.dto.request.RefreshTokenRequest;
import com.internalpj.crm_mini.dto.request.RegisterRequest;
import com.internalpj.crm_mini.dto.response.LoginResponse;
import com.internalpj.crm_mini.dto.response.RefreshTokenResponse;
import com.internalpj.crm_mini.service.RefreshTokenService;
import com.internalpj.crm_mini.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    public AuthController(UserService userService, RefreshTokenService refreshTokenService) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        userService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        //Xử lý trường hợp
        return ResponseEntity.ok(
                ApiResponse.success(userService.login(request)));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@Valid @RequestBody RefreshTokenRequest request) {
        refreshTokenService.revokeRefreshToken(request.getRefreshToken());
        return ResponseEntity.ok(
                ApiResponse.success("Log out successfully"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<RefreshTokenResponse>> refreshToken( @Valid
            @RequestBody RefreshTokenRequest request) {
        String newAccessToken = refreshTokenService.refreshAccessToken(request.getRefreshToken());

        RefreshTokenResponse response = new RefreshTokenResponse(newAccessToken, request.getRefreshToken());

        return ResponseEntity.ok(ApiResponse.success(response));
    }

}
