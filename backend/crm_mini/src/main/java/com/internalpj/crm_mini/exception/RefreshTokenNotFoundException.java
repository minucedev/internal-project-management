package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

public class RefreshTokenNotFoundException extends BusinessException {
    public RefreshTokenNotFoundException() {
        super(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
    }

}
