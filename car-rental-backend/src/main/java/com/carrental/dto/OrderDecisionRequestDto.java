package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderDecisionRequestDto {
    @NotBlank(message = "Decision is required")
    private String decision;

    private String adminNote;
}
