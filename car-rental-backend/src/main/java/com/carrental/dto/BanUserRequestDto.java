package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BanUserRequestDto {
    @NotBlank(message = "Ban reason is required")
    private String reason;
}

