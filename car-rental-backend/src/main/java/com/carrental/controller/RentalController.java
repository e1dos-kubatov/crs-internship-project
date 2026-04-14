package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.RentalRequestDto;
import com.carrental.dto.RentalResponseDto;
import com.carrental.dto.RentalStatusUpdateRequestDto;
import com.carrental.service.RentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<RentalResponseDto>> createRental(@Valid @RequestBody RentalRequestDto request, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rental created successfully", rentalService.createRental(request, principal.getName())));
    }

    @GetMapping("/my-rentals")
    @PreAuthorize("hasAnyRole('ADMIN', 'PARTNER', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<List<RentalResponseDto>>> getCurrentUserRentals(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("User rentals retrieved", rentalService.getUserRentals(principal.getName())));
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RentalResponseDto>>> getAllRentals() {
        return ResponseEntity.ok(ApiResponse.success("All rentals retrieved", rentalService.getAllRentals()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RentalResponseDto>> updateRentalStatus(@PathVariable Long id,
                                                                             @Valid @RequestBody RentalStatusUpdateRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Rental status updated successfully",
                rentalService.updateRentalStatus(id, request.getStatus())
        ));
    }
}

