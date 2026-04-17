package com.carrental.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WebhookEventRequestDto {
    @NotBlank
    private String eventId;

    @NotBlank
    private String eventType;

    @NotBlank
    private String paymentIntentId;

    private String status;

    private String payload;
}
