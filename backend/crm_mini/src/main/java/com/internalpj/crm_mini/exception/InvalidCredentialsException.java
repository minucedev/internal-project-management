package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.ErrorCode;

public class InvalidCredentialsException extends BusinessException {

    public InvalidCredentialsException() {
        super(ErrorCode.INVALID_CREDENTIALS);
    }
}
