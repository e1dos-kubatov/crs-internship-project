package com.carrental.repository;

import com.carrental.entity.Payment;
import com.carrental.entity.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByRentalUserId(Long userId);

    List<Payment> findByRentalId(Long rentalId);

    Optional<Payment> findByPaymentIntentId(String paymentIntentId);

    boolean existsByRentalIdAndStatusIn(Long rentalId, List<PaymentStatus> statuses);
}
