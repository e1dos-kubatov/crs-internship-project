package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RentalStatusUpdateRequestDto {
    @NotBlank(message = "Status is required")
    private String status;
}
