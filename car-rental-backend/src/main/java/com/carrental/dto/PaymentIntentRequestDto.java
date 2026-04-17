package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class PaymentIntentRequestDto {
    @NotNull
    @Positive
    private Long rentalId;

    @NotBlank
    private String provider;

    @NotBlank
    private String paymentMethod;

    private String currency = "USD";
}
