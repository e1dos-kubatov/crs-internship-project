package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentConfirmRequestDto {
    @NotBlank
    private String paymentToken;
}
