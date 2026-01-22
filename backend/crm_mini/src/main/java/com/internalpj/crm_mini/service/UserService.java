package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.controller.auth.enums.RoleType;
import com.internalpj.crm_mini.dto.request.LoginRequest;
import com.internalpj.crm_mini.dto.request.RegisterRequest;
import com.internalpj.crm_mini.dto.response.LoginResponse;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.entity.Role;
import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;
import com.internalpj.crm_mini.exception.InvalidCredentialsException;
import com.internalpj.crm_mini.exception.UserAlreadyExistsException;
import com.internalpj.crm_mini.exception.UserNotFoundException;
import com.internalpj.crm_mini.repository.RoleRepository;
import com.internalpj.crm_mini.repository.UserRepository;
import com.internalpj.crm_mini.security.jwt.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenService refreshTokenService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository, RoleRepository roleRepository,
            PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.refreshTokenService = refreshTokenService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = new User();

        Integer roleId = request.getRoleID() != null ? request.getRoleID() : RoleType.USER.getId();

        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ROLE_NOT_FOUND));

        newUser.setRole(role);
        newUser.setUsername(request.getUsername());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(encodedPassword);

        userRepository.save(newUser);

    }

    public LoginResponse login(LoginRequest loginRequest) {

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(InvalidCredentialsException::new);

        if (!verifyPassword(loginRequest.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                accessToken,
                refreshToken);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User findById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(UserNotFoundException::new);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }
}