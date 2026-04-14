package com.carrental.dto;

import com.carrental.entity.Provider;
import com.carrental.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Provider provider;
}
