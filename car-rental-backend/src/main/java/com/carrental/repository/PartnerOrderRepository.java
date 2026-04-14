package com.carrental.repository;

import com.carrental.entity.OrderStatus;
import com.carrental.entity.PartnerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerOrderRepository extends JpaRepository<PartnerOrder, Long> {
    List<PartnerOrder> findByPartnerId(Long partnerId);

    List<PartnerOrder> findByStatus(OrderStatus status);

    Optional<PartnerOrder> findByVin(String vin);
}
