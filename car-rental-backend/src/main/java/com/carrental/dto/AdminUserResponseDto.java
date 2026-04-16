package com.carrental.dto;

import com.carrental.entity.Role;
import com.carrental.entity.Provider;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminUserResponseDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;
    private boolean isDeleted;
    private boolean banned;
    private String bannedReason;
}

