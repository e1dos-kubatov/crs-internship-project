package com.carrental.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CarRequestDto {
    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotNull(message = "Year is required")
    @Positive(message = "Year must be positive")
    private Integer year;

    @NotBlank(message = "VIN is required")
    @Size(min = 11, max = 17, message = "VIN must be between 11 and 17 characters")
    private String vin;

    @NotNull(message = "Price per day is required")
    @DecimalMin(value = "0.01", message = "Price per day must be greater than zero")
    private BigDecimal pricePerDay;

    @NotBlank(message = "Transmission is required")
    private String transmission;

    @NotBlank(message = "Fuel is required")
    private String fuel;

    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;

    private String description;
}
