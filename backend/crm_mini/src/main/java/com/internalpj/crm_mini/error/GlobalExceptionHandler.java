package com.internalpj.crm_mini.error;

import com.internalpj.crm_mini.exception.*;
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
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // ==================== Custom Project Management Exceptions
        // ====================

        /**
         * Handle NotFoundException (404).
         */
        @ExceptionHandler(NotFoundException.class)
        public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
                logger.warn("Resource not found: {}", ex.getMessage());

                ErrorResponse response = new ErrorResponse(
                                "NOT_FOUND",
                                ex.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        /**
         * Handle ForbiddenException (403).
         */
        @ExceptionHandler(ForbiddenException.class)
        public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenException ex) {
                logger.warn("Access forbidden: {}", ex.getMessage());

                ErrorResponse response = new ErrorResponse(
                                "FORBIDDEN",
                                ex.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        /**
         * Handle ConflictException (409).
         */
        @ExceptionHandler(ConflictException.class)
        public ResponseEntity<ErrorResponse> handleConflictException(ConflictException ex) {
                logger.warn("Conflict occurred: {}", ex.getMessage());

                ErrorResponse response = new ErrorResponse(
                                "CONFLICT",
                                ex.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        /**
         * Handle BadRequestException (400).
         */
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
                logger.warn("Bad request: {}", ex.getMessage());

                ErrorResponse response = new ErrorResponse(
                                "BAD_REQUEST",
                                ex.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        /**
         * Handle UnauthorizedException (401).
         */
        @ExceptionHandler(UnauthorizedException.class)
        public ResponseEntity<ErrorResponse> handleUnauthorizedException(UnauthorizedException ex) {
                logger.warn("Unauthorized access attempt: {}", ex.getMessage());

                ErrorResponse response = new ErrorResponse(
                                "UNAUTHORIZED",
                                ex.getMessage(),
                                LocalDate.now());

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // ==================== Existing Exception Handlers ====================

        /**
         * Handle BusinessException (existing).
         */
        @ExceptionHandler(BusinessException.class)
        public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException ex) {
                logger.warn("Business exception occurred: {} - {}",
                                ex.getErrorCode().getCode(),
                                ex.getErrorCode().getMessage());

                ErrorCode errorCode = ex.getErrorCode();
                ErrorResponse response = new ErrorResponse(
                                errorCode.getCode(),
                                errorCode.getMessage(),
                                LocalDate.now());

                return ResponseEntity.badRequest().body(response);
        }

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
                                "VALIDATION_ERROR",
                                message,
                                LocalDate.now());

                return ResponseEntity.badRequest().body(response);
        }

        /**
         * Handle all other unexpected exceptions.
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
