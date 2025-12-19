package com.internalpj.crm_mini.error;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDate timestamp;

}
