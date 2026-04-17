package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.JwtResponse;
import com.carrental.dto.UserLoginRequest;
import com.carrental.dto.UserRegisterRequest;
import com.carrental.dto.UserResponseDto;
import com.carrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Value("${spring.security.oauth2.client.registration.google.client-id:}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret:}")
    private String googleClientSecret;

    @Value("${app.backend.url:http://localhost:${server.port}}")
    private String backendUrl;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<JwtResponse>> register(
            @Valid @RequestBody UserRegisterRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success(
                        "User registered successfully",
                        authService.register(request)
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(
            @Valid @RequestBody UserLoginRequest request) {

        return ResponseEntity.ok(
                ApiResponse.success(
                        "Login successful",
                        authService.login(request)
                )
        );
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponseDto>> me(Principal principal) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Current user retrieved successfully",
                        authService.getCurrentUser(principal.getName())
                )
        );
    }

    @GetMapping("/oauth2/status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> oauth2Status() {
        boolean googleConfigured = hasGoogleClientId() && hasValue(googleClientSecret);
        return ResponseEntity.ok(
                ApiResponse.success(
                        "OAuth2 status retrieved successfully",
                        Map.of(
                                "google", googleConfigured,
                                "googleRedirectUri", normalizeUrl(backendUrl) + "/login/oauth2/code/google"
                        )
                )
        );
    }

    private boolean hasGoogleClientId() {
        return hasValue(googleClientId)
                && googleClientId.endsWith(".apps.googleusercontent.com")
                && !googleClientId.contains("your_google_client_id")
                && !googleClientId.contains("oauth-not-configured");
    }

    private boolean hasValue(String value) {
        return value != null && !value.isBlank();
    }

    private String normalizeUrl(String url) {
        if (url == null || url.isBlank()) {
            return "http://localhost:8080";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
