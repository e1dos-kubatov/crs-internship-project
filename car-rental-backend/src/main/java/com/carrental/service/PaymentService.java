package com.carrental.service;

import com.carrental.dto.PaymentConfirmRequestDto;
import com.carrental.dto.PaymentIntentRequestDto;
import com.carrental.dto.PaymentResponseDto;
import com.carrental.dto.RefundRequestDto;
import com.carrental.dto.RefundResponseDto;
import com.carrental.dto.WebhookEventRequestDto;
import com.carrental.entity.Payment;
import com.carrental.entity.PaymentProvider;
import com.carrental.entity.PaymentStatus;
import com.carrental.entity.Refund;
import com.carrental.entity.RefundStatus;
import com.carrental.entity.Rental;
import com.carrental.entity.RentalStatus;
import com.carrental.entity.User;
import com.carrental.entity.WebhookEvent;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.exception.UnauthorizedException;
import com.carrental.repository.PaymentRepository;
import com.carrental.repository.RefundRepository;
import com.carrental.repository.RentalRepository;
import com.carrental.repository.UserRepository;
import com.carrental.repository.WebhookEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RefundRepository refundRepository;
    private final WebhookEventRepository webhookEventRepository;
    private final RentalRepository rentalRepository;
    private final UserRepository userRepository;

    @Transactional
    public PaymentResponseDto createIntent(PaymentIntentRequestDto request, String userEmail) {
        User user = findUserByEmail(userEmail);
        Rental rental = findRental(request.getRentalId());
        assertRentalOwnerOrAdmin(rental, user);

        if (rental.getStatus() == RentalStatus.CANCELLED || rental.getStatus() == RentalStatus.COMPLETED) {
            throw new BadRequestException("Cancelled or completed rentals cannot be paid");
        }

        boolean existingPayment = paymentRepository.existsByRentalIdAndStatusIn(
                rental.getId(),
                List.of(PaymentStatus.PENDING, PaymentStatus.PROCESSING, PaymentStatus.SUCCEEDED)
        );
        if (existingPayment) {
            throw new BadRequestException("This rental already has an active payment");
        }

        Payment payment = Payment.builder()
                .rental(rental)
                .provider(parseProvider(request.getProvider()))
                .paymentMethod(request.getPaymentMethod().trim())
                .paymentIntentId("demo_pi_" + UUID.randomUUID())
                .amount(rental.getTotalPrice())
                .currency(normalizeCurrency(request.getCurrency()))
                .status(PaymentStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return mapToResponse(paymentRepository.save(payment), true);
    }

    @Transactional
    public PaymentResponseDto confirmPayment(Long paymentId, PaymentConfirmRequestDto request, String userEmail) {
        User user = findUserByEmail(userEmail);
        Payment payment = findPayment(paymentId);
        assertRentalOwnerOrAdmin(payment.getRental(), user);

        if (payment.getStatus() != PaymentStatus.PENDING && payment.getStatus() != PaymentStatus.PROCESSING) {
            throw new BadRequestException("Payment cannot be confirmed from its current status");
        }
        if (!request.getPaymentToken().startsWith("tok_")) {
            payment.setStatus(PaymentStatus.FAILED);
            payment.setUpdatedAt(LocalDateTime.now());
            return mapToResponse(paymentRepository.save(payment), false);
        }

        payment.setStatus(PaymentStatus.PROCESSING);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        WebhookEventRequestDto webhook = new WebhookEventRequestDto();
        webhook.setEventId("evt_" + UUID.randomUUID());
        webhook.setEventType("payment_intent.succeeded");
        webhook.setPaymentIntentId(saved.getPaymentIntentId());
        webhook.setStatus("SUCCEEDED");
        webhook.setPayload("{\"demo\":true,\"paymentIntentId\":\"" + saved.getPaymentIntentId() + "\"}");
        processWebhook(saved.getProvider().name(), webhook);

        return mapToResponse(findPayment(paymentId), false);
    }

    public List<PaymentResponseDto> getMyPayments(String userEmail) {
        User user = findUserByEmail(userEmail);
        return paymentRepository.findByRentalUserId(user.getId()).stream()
                .map(payment -> mapToResponse(payment, false))
                .toList();
    }

    public List<PaymentResponseDto> getRentalPayments(Long rentalId, String userEmail) {
        User user = findUserByEmail(userEmail);
        Rental rental = findRental(rentalId);
        assertRentalOwnerOrAdmin(rental, user);
        return paymentRepository.findByRentalId(rentalId).stream()
                .map(payment -> mapToResponse(payment, false))
                .toList();
    }

    @Transactional
    public PaymentResponseDto processWebhook(String providerValue, WebhookEventRequestDto request) {
        PaymentProvider provider = parseProvider(providerValue);
        if (webhookEventRepository.existsByEventId(request.getEventId())) {
            Payment existing = paymentRepository.findByPaymentIntentId(request.getPaymentIntentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
            return mapToResponse(existing, false);
        }

        Payment payment = paymentRepository.findByPaymentIntentId(request.getPaymentIntentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        WebhookEvent event = WebhookEvent.builder()
                .provider(provider)
                .eventId(request.getEventId())
                .eventType(request.getEventType())
                .payload(request.getPayload() == null || request.getPayload().isBlank() ? "{}" : request.getPayload())
                .processedAt(LocalDateTime.now())
                .build();
        webhookEventRepository.save(event);

        String eventType = request.getEventType().toLowerCase(Locale.ROOT);
        if (eventType.contains("succeeded") || "SUCCEEDED".equalsIgnoreCase(request.getStatus())) {
            payment.setStatus(PaymentStatus.SUCCEEDED);
            payment.setTransactionId("demo_txn_" + UUID.randomUUID());
        } else if (eventType.contains("failed") || "FAILED".equalsIgnoreCase(request.getStatus())) {
            payment.setStatus(PaymentStatus.FAILED);
        }

        payment.setUpdatedAt(LocalDateTime.now());
        return mapToResponse(paymentRepository.save(payment), false);
    }

    @Transactional
    public RefundResponseDto createRefund(Long paymentId, RefundRequestDto request, String userEmail) {
        User user = findUserByEmail(userEmail);
        Payment payment = findPayment(paymentId);
        assertRentalOwnerOrAdmin(payment.getRental(), user);

        if (payment.getStatus() != PaymentStatus.SUCCEEDED && payment.getStatus() != PaymentStatus.PARTIALLY_REFUNDED) {
            throw new BadRequestException("Only successful payments can be refunded");
        }
        if (request.getAmount().compareTo(payment.getAmount()) > 0) {
            throw new BadRequestException("Refund amount cannot be greater than payment amount");
        }

        Refund refund = Refund.builder()
                .payment(payment)
                .amount(request.getAmount())
                .reason(request.getReason().trim())
                .status(RefundStatus.SUCCEEDED)
                .createdAt(LocalDateTime.now())
                .build();

        payment.setStatus(request.getAmount().compareTo(payment.getAmount()) == 0
                ? PaymentStatus.REFUNDED
                : PaymentStatus.PARTIALLY_REFUNDED);
        payment.setUpdatedAt(LocalDateTime.now());
        if (payment.getStatus() == PaymentStatus.REFUNDED) {
            payment.getRental().setStatus(RentalStatus.CANCELLED);
        }
        paymentRepository.save(payment);

        return mapRefund(refundRepository.save(refund));
    }

    private PaymentResponseDto mapToResponse(Payment payment, boolean includeClientSecret) {
        return PaymentResponseDto.builder()
                .id(payment.getId())
                .rentalId(payment.getRental().getId())
                .provider(payment.getProvider())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .paymentIntentId(payment.getPaymentIntentId())
                .clientSecret(includeClientSecret ? payment.getPaymentIntentId() + "_secret_demo" : null)
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    private RefundResponseDto mapRefund(Refund refund) {
        return RefundResponseDto.builder()
                .id(refund.getId())
                .paymentId(refund.getPayment().getId())
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .status(refund.getStatus())
                .createdAt(refund.getCreatedAt())
                .build();
    }

    private Payment findPayment(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    private Rental findRental(Long rentalId) {
        return rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void assertRentalOwnerOrAdmin(Rental rental, User user) {
        boolean admin = user.getRole() == com.carrental.entity.Role.ROLE_ADMIN
                || user.getRole() == com.carrental.entity.Role.ROLE_SUPERADMIN;
        if (!admin && !rental.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You cannot access this payment");
        }
    }

    private PaymentProvider parseProvider(String value) {
        try {
            return PaymentProvider.valueOf(String.valueOf(value).trim().toUpperCase(Locale.ROOT));
        } catch (RuntimeException ex) {
            throw new BadRequestException("Unsupported payment provider");
        }
    }

    private String normalizeCurrency(String currency) {
        String normalized = String.valueOf(currency == null ? "USD" : currency).trim().toUpperCase(Locale.ROOT);
        return normalized.length() == 3 ? normalized : "USD";
    }
}
