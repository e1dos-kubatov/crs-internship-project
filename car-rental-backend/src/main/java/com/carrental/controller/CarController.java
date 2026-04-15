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
    // FIXED: Allowed both ADMIN and PARTNER to create cars directly
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_PARTNER')")
    public ResponseEntity<ApiResponse<CarResponseDto>> createCar(
            @Valid @RequestBody CarRequestDto request,
            Principal principal) { // Added Principal to get the user's email

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Car created successfully", carService.createCar(request, principal.getName())));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getAllCars() {
        return ResponseEntity.ok(ApiResponse.success("Cars retrieved successfully", carService.getAvailableCars()));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getAllCarsForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("Admin cars retrieved successfully", carService.getAllCarsForAdmin()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyAuthority('ROLE_PARTNER', 'ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<List<CarResponseDto>>> getMyCars(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Owned cars retrieved successfully", carService.getCarsOwnedBy(principal.getName())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CarResponseDto>> getCar(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Car retrieved successfully", carService.getCarById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<CarResponseDto>> updateCar(
            @PathVariable Long id,
            @Valid @RequestBody CarRequestDto request,
            Principal principal) { // <-- Pass Principal here
        return ResponseEntity.ok(ApiResponse.success("Car updated successfully", carService.updateCar(id, request, principal.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCar(
            @PathVariable Long id,
            Principal principal) { // <-- Pass Principal here
        carService.deleteCar(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Car deleted successfully", null));
    }
}