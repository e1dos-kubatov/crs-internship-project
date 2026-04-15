package com.carrental.controller;

import com.carrental.dto.AdminUserResponseDto;
import com.carrental.dto.ApiResponse;
import com.carrental.dto.AuditLogResponseDto;
import com.carrental.dto.BanUserRequestDto;
import com.carrental.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
// ИЗМЕНЕНО: hasAuthority вместо hasRole, чтобы избежать конфликта с префиксом "ROLE_"
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_SUPERADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponseDto>>> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("Users retrieved", adminService.getAllUsers())
        );
    }

    @PatchMapping("/users/{userId}/ban")
    public ResponseEntity<ApiResponse<Void>> banUser(
            @PathVariable Long userId,
            @Valid @RequestBody BanUserRequestDto request
    ) {
        adminService.banUser(userId, request);

        return ResponseEntity.ok(
                ApiResponse.success("User banned successfully", null)
        );
    }

    @GetMapping("/logs")
    // ИЗМЕНЕНО: То же самое здесь, используем hasAuthority
    @PreAuthorize("hasAuthority('ROLE_SUPERADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogResponseDto>>> getAuditLogs() {
        return ResponseEntity.ok(
                ApiResponse.success("Audit logs retrieved", adminService.getAuditLogs())
        );
    }
}