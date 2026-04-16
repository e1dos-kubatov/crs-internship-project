package com.carrental.dto;

import com.carrental.entity.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PartnerOrderResponseDto {
    private Long id;
    private Long partnerId;
    private String partnerName;
    private String partnerEmail;
    private String brand;
    private String model;
    private Integer year;
    private String vin;
    private BigDecimal pricePerDay;
    private String transmission;
    private String fuel;
    private String description;
    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;
    private OrderStatus status;
    private String adminNote;
    private Long approvedCarId;
    private LocalDateTime createdAt;
}
