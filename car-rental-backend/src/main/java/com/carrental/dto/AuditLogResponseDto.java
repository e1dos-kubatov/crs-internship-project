package com.carrental.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditLogResponseDto {
    private Long id;
    private Long userId;
    private String action;
    private LocalDateTime timestamp;
    private String ipAddress;
    private String details;
}

