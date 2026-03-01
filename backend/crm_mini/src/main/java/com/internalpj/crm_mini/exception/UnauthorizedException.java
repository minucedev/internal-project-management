package com.internalpj.crm_mini.exception;

import com.internalpj.crm_mini.error.BusinessException;
import com.internalpj.crm_mini.error.enums.ErrorCode;

/**
 * Exception thrown when authentication is required but not provided or invalid.
 * Maps to HTTP 401 Unauthorized.
 * 
 * Note: This may already be handled by Spring Security,
 * but included here for completeness.
 */
public class UnauthorizedException extends BusinessException {

    /**
     * Creates an UnauthorizedException with the specified ErrorCode.
     *
     * @param errorCode the error code (should be an UNAUTHORIZED type)
     */
    public UnauthorizedException(ErrorCode errorCode) {
        super(errorCode);
    }

    /**
     * Creates an UnauthorizedException with a custom message.
     *
     * @param errorCode     the error code
     * @param customMessage custom error message
     */
    public UnauthorizedException(ErrorCode errorCode, String customMessage) {
        super(errorCode, customMessage);
    }

    // ==================== Static Factory Methods ====================

    /**
     * For generic unauthorized access.
     *
     * @return UnauthorizedException with UNAUTHORIZED error code
     */
    public static UnauthorizedException unauthorized() {
        return new UnauthorizedException(ErrorCode.UNAUTHORIZED);
    }

    /**
     * For expired tokens.
     *
     * @return UnauthorizedException with TOKEN_EXPIRED error code
     */
    public static UnauthorizedException tokenExpired() {
        return new UnauthorizedException(ErrorCode.TOKEN_EXPIRED);
    }

    /**
     * For invalid tokens.
     *
     * @return UnauthorizedException with INVALID_TOKEN error code (generic)
     */
    public static UnauthorizedException invalidToken() {
        return new UnauthorizedException(ErrorCode.INVALID_TOKEN);
    }
}
