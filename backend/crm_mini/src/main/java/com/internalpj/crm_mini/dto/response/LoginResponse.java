package com.internalpj.crm_mini.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private Long userId;
    private String username;
    private String email;
    private String accessToken;
}
