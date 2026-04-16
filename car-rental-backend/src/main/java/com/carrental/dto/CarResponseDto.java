package com.carrental.dto;

import com.carrental.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarResponseDto {
    private Long id;
    private String brand;
    private String model;
    private Integer year;
    private String vin;
    private BigDecimal pricePerDay;
    private String description;
    private OrderStatus status;
    private String adminNote;
    private boolean available;
    private Long ownerId;
    private String ownerName;
    private LocalDateTime createdAt;
}
