package com.employeemgmt.exception;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the entire application.
 *
 * @RestControllerAdvice is a specialisation of @ControllerAdvice that
 * applies to every @RestController.  Any exception thrown during request
 * processing is caught here so we can return a consistent JSON error
 * response instead of an ugly stack trace.
 *
 * Every error response follows the same structure:
 *   {
 *     "timestamp": "2024-01-15T10:30:00",
 *     "status":    404,
 *     "message":   "Employee not found with id : 42",
 *     "details":   { ... }          // additional context (optional)
 *   }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ──────────── 1. Resource Not Found (404) ────────────────────────────

    /**
     * Handles our custom ResourceNotFoundException.
     * Returns HTTP 404 with a clear error message.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(
            ResourceNotFoundException ex) {

        Map<String, Object> details = new HashMap<>();
        details.put("resource", ex.getResourceName());
        details.put("field", ex.getFieldName());
        details.put("value", ex.getFieldValue());

        Map<String, Object> body = buildErrorBody(
                HttpStatus.NOT_FOUND, ex.getMessage(), details);

        return new ResponseEntity<>(body, HttpStatus.NOT_FOUND);
    }

    // ──────────── 2. Validation Errors (400) ─────────────────────────────

    /**
     * Handles validation failures triggered by @Valid.
     *
     * When the request body fails validation (e.g., blank first name,
     * invalid email), Spring throws MethodArgumentNotValidException.
     * We extract every field error and return them in a map so the
     * frontend can display per-field messages.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        // Collect field-level errors: { "firstName": "First name is required", ... }
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }

        Map<String, Object> body = buildErrorBody(
                HttpStatus.BAD_REQUEST, "Validation failed", fieldErrors);

        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    // ──────────── 3. Duplicate Key / Unique Index Violation (409) ────────

    /**
     * Handles MongoDB duplicate key exceptions — most commonly a duplicate
     * email address (the "email" field has a unique index).
     *
     * Returns HTTP 409 (Conflict).
     */
    @ExceptionHandler(DuplicateKeyException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateKeyException(
            DuplicateKeyException ex) {

        String message = "An employee with this email address already exists";

        Map<String, Object> body = buildErrorBody(
                HttpStatus.CONFLICT, message, null);

        return new ResponseEntity<>(body, HttpStatus.CONFLICT);
    }

    // ──────────── 4. Catch-All (500) ─────────────────────────────────────

    /**
     * Catches any other unhandled exception and returns a generic
     * HTTP 500 (Internal Server Error) response.
     *
     * In production you would NOT expose ex.getMessage() directly
     * (it could leak implementation details). For development/learning
     * purposes we include it here.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGlobalException(Exception ex) {

        Map<String, Object> body = buildErrorBody(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred",
                ex.getMessage());

        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // ──────────── Helper ─────────────────────────────────────────────────

    /**
     * Builds the standard error response body used by all handlers.
     *
     * @param status  HTTP status enum
     * @param message human-readable error message
     * @param details additional context (may be null)
     * @return a map ready to be serialised to JSON
     */
    private Map<String, Object> buildErrorBody(HttpStatus status, String message, Object details) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("message", message);
        body.put("details", details);
        return body;
    }
}
