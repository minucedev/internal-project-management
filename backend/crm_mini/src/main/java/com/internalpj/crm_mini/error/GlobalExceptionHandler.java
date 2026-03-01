package com.internalpj.crm_mini.error;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.internalpj.crm_mini.error.enums.ErrorCode;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Global exception handler for all REST API endpoints.
 * Provides consistent error responses across the application.
 * 
 * All business exceptions are handled through the unified BusinessException
 * handler,
 * which automatically maps ErrorCode to appropriate HTTP status codes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // ==================== Business Exception Handler ====================

        /**
         * Handles all BusinessException instances (including subclasses).
         * Automatically maps ErrorCode to appropriate HTTP status code.
         * 
         * This single handler replaces individual handlers for:
         * - NotFoundException (404)
         * - ForbiddenException (403)
         * - ConflictException (409)
         * - BadRequestException (400)
         * - UnauthorizedException (401)
         */
        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
                ErrorCode errorCode = ex.getErrorCode();
                HttpStatus httpStatus = ex.getHttpStatus();

                // Log with appropriate level based on status
                if (httpStatus.is5xxServerError()) {
                        logger.error("Business exception occurred: {} - {}",
                                        errorCode.getCode(), ex.getMessage(), ex);
                } else {
                        logger.warn("Business exception occurred: {} - {}",
                                        errorCode.getCode(), ex.getMessage());
                }

                ErrorResponse response = new ErrorResponse(
                                errorCode.getCode(),
                                ex.getMessage(), // Use actual exception message (may be customized)
                                LocalDate.now());

                return ResponseEntity.status(httpStatus).body(response);
        }

        // ==================== Validation Exception Handler ====================

        /**
         * Handle validation errors from @Valid annotations.
         */
        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
                List<String> errors = ex.getBindingResult()
                                .getFieldErrors()
                                .stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .collect(Collectors.toList());

                String message = String.join(", ", errors);

                logger.warn("Validation failed: {}", message);

                ErrorResponse response = new ErrorResponse(
                                ErrorCode.VALIDATION_ERROR.getCode(),
                                message,
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        // ==================== System Exception Handler ====================

        /**
         * Handle all other unexpected exceptions.
         * This is the catch-all handler for any unhandled exceptions.
         */
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleSystemException(Exception ex) {
                logger.error("Unexpected system error occurred", ex);

                ErrorResponse response = new ErrorResponse(
                                ErrorCode.INTERNAL_ERROR.getCode(),
                                ErrorCode.INTERNAL_ERROR.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
}
