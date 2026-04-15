package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.JwtResponse;
import com.carrental.dto.UserLoginRequest;
import com.carrental.dto.UserRegisterRequest;
import com.carrental.dto.UserResponseDto;
import com.carrental.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}