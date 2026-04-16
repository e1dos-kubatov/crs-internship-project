package com.carrental.service;

import com.carrental.dto.AdminUserResponseDto;
import com.carrental.dto.AuditLogResponseDto;
import com.carrental.dto.BanUserRequestDto;
import com.carrental.entity.AuditLog;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.AuditLogRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final AuditService auditService;

    public List<AdminUserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .filter(u -> !u.isDeleted())
                .map(this::mapToAdminUserDto)
                .collect(Collectors.toList());
    }

    public void banUser(Long userId, BanUserRequestDto request) {
        User user = findManageableUser(userId);

        user.setBanned(true);
        user.setBannedReason(request.getReason());
        user.setEnabled(false);
        userRepository.save(user);

        auditService.logAction("BAN_USER", userId, "User banned: " + request.getReason());
    }

    public void unbanUser(Long userId) {
        User user = findManageableUser(userId);

        user.setBanned(false);
        user.setBannedReason(null);
        user.setEnabled(true);
        userRepository.save(user);

        auditService.logAction("UNBAN_USER", userId, "User unbanned");
    }

    public void deleteUser(Long userId) {
        User user = findManageableUser(userId);

        user.setDeleted(true);
        user.setEnabled(false);
        userRepository.save(user);

        auditService.logAction("DELETE_USER", userId, "User soft-deleted");
    }

    public List<AuditLogResponseDto> getAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc().stream()
                .map(this::mapToAuditLogDto)
                .collect(Collectors.toList());
    }

    private AdminUserResponseDto mapToAdminUserDto(User user) {
        return AdminUserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .provider(user.getProvider())
                .isDeleted(user.isDeleted())
                .banned(user.isBanned())
                .bannedReason(user.getBannedReason())
                .build();
    }

    private User findManageableUser(Long userId) {
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentAdmin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Current admin not found"));

        if (currentAdmin.getId().equals(userId)) {
            throw new BadRequestException("You cannot apply this action to your own account");
        }

        return userRepository.findById(userId)
                .filter(user -> !user.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AuditLogResponseDto mapToAuditLogDto(AuditLog log) {
        return AuditLogResponseDto.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .action(log.getAction())
                .timestamp(log.getTimestamp())
                .ipAddress(log.getIpAddress())
                .details(log.getDetails())
                .build();
    }
}

