package com.carrental.dto;

import com.carrental.entity.PaymentProvider;
import com.carrental.entity.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponseDto {
    private Long id;
    private Long rentalId;
    private PaymentProvider provider;
    private String paymentMethod;
    private String transactionId;
    private String paymentIntentId;
    private String clientSecret;
    private BigDecimal amount;
    private String currency;
    private PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
