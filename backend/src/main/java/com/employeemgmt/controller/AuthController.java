package com.employeemgmt.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.employeemgmt.model.User;
import com.employeemgmt.repository.UserRepository;

/**
 * Handles authentication-related endpoints (register &amp; login).
 * Only Gmail addresses (@gmail.com) are accepted.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;

    /** Constructor injection for the user repository. */
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ─────────────────────────── Register ───────────────────────────

    /**
     * Registers a new user.
     *
     * <ul>
     *   <li>Validates that the email ends with @gmail.com (case-insensitive).</li>
     *   <li>Checks for duplicate email addresses.</li>
     *   <li>Saves the user to MongoDB and returns the created user info.</li>
     * </ul>
     *
     * @param body JSON map containing "name", "email", and "password"
     * @return a structured JSON response with success status and message
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {

        String name = body.get("name");
        String email = body.get("email");
        String password = body.get("password");

        // Gmail-only validation
        if (email == null || !email.toLowerCase().endsWith("@gmail.com")) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Authentication - Only Gmail addresses are allowed");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Duplicate-email check
        if (userRepository.existsByEmail(email)) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Email already registered");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
        }

        // Persist new user
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        User savedUser = userRepository.save(user);

        // Build success response
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", savedUser.getId());
        userInfo.put("name", savedUser.getName());
        userInfo.put("email", savedUser.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Registration successful");
        response.put("user", userInfo);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ──────────────────────────── Login ────────────────────────────

    /**
     * Authenticates an existing user.
     *
     * <ul>
     *   <li>Validates that the email ends with @gmail.com (case-insensitive).</li>
     *   <li>Looks up the user by email.</li>
     *   <li>Compares the provided password with the stored password (plain-text).</li>
     * </ul>
     *
     * @param body JSON map containing "email" and "password"
     * @return a structured JSON response with success status and message
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String password = body.get("password");

        // Gmail-only validation
        if (email == null || !email.toLowerCase().endsWith("@gmail.com")) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Look up user
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        User user = optionalUser.get();

        // Plain-text password comparison
        if (!user.getPassword().equals(password)) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Invalid Authentication");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        // Build success response
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("name", user.getName());
        userInfo.put("email", user.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful");
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }
}
