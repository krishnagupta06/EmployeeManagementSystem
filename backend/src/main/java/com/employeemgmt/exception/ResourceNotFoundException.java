package com.employeemgmt.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Custom exception thrown when a requested resource is not found in the database.
 *
 * @ResponseStatus(HttpStatus.NOT_FOUND) tells Spring to return a 404 status
 * code whenever this exception is thrown (unless a @ControllerAdvice handler
 * overrides the behaviour — which our GlobalExceptionHandler does).
 *
 * Example usage:
 *   throw new ResourceNotFoundException("Employee", "id", 42);
 *   → message: "Employee not found with id : 42"
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Name of the resource (e.g., "Employee")
    private final String resourceName;

    // Name of the field used for the lookup (e.g., "id")
    private final String fieldName;

    // Value of the field (e.g., 42)
    private final Object fieldValue;

    /**
     * Constructs a new ResourceNotFoundException.
     *
     * @param resourceName the type of resource that was not found
     * @param fieldName    the field used to search for the resource
     * @param fieldValue   the value that was searched for
     */
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        // Build a descriptive error message and pass it to RuntimeException
        super(String.format("%s not found with %s : '%s'", resourceName, fieldName, fieldValue));
        this.resourceName = resourceName;
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    // ──────────────────────────── Getters ─────────────────────────────

    public String getResourceName() {
        return resourceName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public Object getFieldValue() {
        return fieldValue;
    }
}
