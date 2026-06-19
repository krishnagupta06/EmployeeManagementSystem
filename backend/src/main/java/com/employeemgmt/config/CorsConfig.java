package com.employeemgmt.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Global CORS (Cross-Origin Resource Sharing) configuration.
 *
 * Browsers enforce the Same-Origin Policy: a page loaded from
 * http://localhost:5173 (your React/Vite frontend) is NOT allowed to
 * make AJAX requests to http://localhost:8080 (this Spring Boot API)
 * unless the server explicitly permits it.
 *
 * This configuration class tells Spring to send the proper CORS headers
 * so the browser allows the frontend to talk to the backend.
 *
 * Note: The @CrossOrigin annotation on the controller provides per-endpoint
 * CORS.  This @Configuration class provides application-wide CORS and acts
 * as a safety net so ALL endpoints (including error pages) return the
 * correct headers.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Register CORS mappings for the entire application.
     *
     * @param registry the CorsRegistry provided by Spring
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry
                // Apply to ALL URL patterns (every endpoint)
                .addMapping("/**")

                // Allow requests from the Vite development server
                .allowedOrigins("http://localhost:5173")

                // Allow these HTTP methods
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                // Allow any request header (e.g., Content-Type, Authorization)
                .allowedHeaders("*")

                // Allow cookies / auth headers to be sent with requests
                .allowCredentials(true);
    }
}
