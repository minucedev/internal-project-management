package com.internalpj.crm_mini.service;

import com.internalpj.crm_mini.dto.request.LoginRequest;
import com.internalpj.crm_mini.dto.request.RegisterRequest;
import com.internalpj.crm_mini.dto.response.LoginResponse;
import com.internalpj.crm_mini.entity.User;
import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.ErrorCode;
import com.internalpj.crm_mini.exception.InvalidCredentialsException;
import com.internalpj.crm_mini.exception.UserAlreadyExistsException;
import com.internalpj.crm_mini.exception.UserNotFoundException;
import com.internalpj.crm_mini.repository.UserRepository;
import com.internalpj.crm_mini.security.jwt.JwtTokenProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void register(RegisterRequest request) { // Use DTO instead

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException();
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User newUser = new User();

        newUser.setRoleId(request.getRoleID());
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

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());

        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                token);
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