package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.PaymentConfirmRequestDto;
import com.carrental.dto.PaymentIntentRequestDto;
import com.carrental.dto.PaymentResponseDto;
import com.carrental.dto.RefundRequestDto;
import com.carrental.dto.RefundResponseDto;
import com.carrental.dto.WebhookEventRequestDto;
import com.carrental.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/intents")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> createIntent(@Valid @RequestBody PaymentIntentRequestDto request,
                                                                        Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Payment intent created", paymentService.createIntent(request, principal.getName())));
    }

    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> confirm(@PathVariable Long id,
                                                                   @Valid @RequestBody PaymentConfirmRequestDto request,
                                                                   Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed", paymentService.confirmPayment(id, request, principal.getName())));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> myPayments(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved", paymentService.getMyPayments(principal.getName())));
    }

    @GetMapping("/rentals/{rentalId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<ApiResponse<List<PaymentResponseDto>>> rentalPayments(@PathVariable Long rentalId,
                                                                               Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Rental payments retrieved", paymentService.getRentalPayments(rentalId, principal.getName())));
    }

    @PostMapping("/{id}/refunds")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER')")
    public ResponseEntity<ApiResponse<RefundResponseDto>> refund(@PathVariable Long id,
                                                                 @Valid @RequestBody RefundRequestDto request,
                                                                 Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Refund created", paymentService.createRefund(id, request, principal.getName())));
    }

    @PostMapping("/webhooks/{provider}")
    public ResponseEntity<ApiResponse<PaymentResponseDto>> webhook(@PathVariable String provider,
                                                                   @Valid @RequestBody WebhookEventRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Webhook processed", paymentService.processWebhook(provider, request)));
    }
}
