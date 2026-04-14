package com.carrental.dto;

import lombok.Builder;
import lombok.Data;

import com.carrental.entity.RentalStatus;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class RentalResponseDto {
    private Long id;
    private Long userId;
    private String userEmail;
    private Long carId;
    private String carBrand;
    private String carModel;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal totalPrice;
    private RentalStatus status;
    private LocalDateTime createdAt;
}
