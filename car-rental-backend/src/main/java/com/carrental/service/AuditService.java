package com.carrental.service;

import com.carrental.entity.AuditLog;
import com.carrental.repository.AuditLogRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public void logAction(String action,
                          Long targetUserId,
                          String details,
                          String ipAddress) {

        String adminEmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        Long adminId = userRepository.findByEmail(adminEmail)
                .orElseThrow()
                .getId();

        AuditLog log = AuditLog.builder()
                .userId(adminId)
                .targetUserId(targetUserId)
                .action(action)
                .details(details)
                .ipAddress(ipAddress)
                .timestamp(LocalDateTime.now())
                .build();

        auditLogRepository.save(log);
    }

    public void logAction(String action,
                          Long targetUserId,
                          String details) {

        logAction(action, targetUserId, details, "UNKNOWN");
    }
}