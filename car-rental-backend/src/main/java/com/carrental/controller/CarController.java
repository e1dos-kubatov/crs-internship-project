package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.CarRequestDto;
import com.carrental.dto.CarResponseDto;
import com.carrental.service.CarService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {

    private final CarService carService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarResponseDto>> createCar(@Valid @RequestBody CarRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Car created successfully", carService.createCar(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getAllCars() {
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", carService.getAvailableCars()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getAllCarsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Admin cars retrieved successfully", carService.getAllCarsForAdmin()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('PARTNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getMyCars(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Owned cars retrieved successfully", carService.getCarsOwnedBy(principal.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponseDto>> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Car retrieved successfully", carService.getCarById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CarResponseDto>> updateCar(@PathVariable Long id, @Valid @RequestBody CarRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", carService.updateCar(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }
}
