package com.carrental.controller;

import com.carrental.dto.ApiResponse;
import com.carrental.dto.OrderDecisionRequestDto;
import com.carrental.dto.PartnerOrderRequestDto;
import com.carrental.dto.PartnerOrderResponseDto;
import com.carrental.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasAnyRole('PARTNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PartnerOrderResponseDto>> createOrder(@Valid @RequestBody PartnerOrderRequestDto request,
                                                                            Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Partner order created successfully", orderService.createOrder(request, principal.getName())));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('PARTNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PartnerOrderResponseDto>>> getMyOrders(Principal principal) {
        return ResponseEntity.ok(ApiResponse.success("Partner orders retrieved successfully", orderService.getMyOrders(principal.getName())));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PartnerOrderResponseDto>>> getAllOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders retrieved successfully", orderService.getAllOrders()));
    }

    @PatchMapping("/{id}/decision")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PartnerOrderResponseDto>> decideOrder(@PathVariable Long id,
                                                                            @Valid @RequestBody OrderDecisionRequestDto request) {
        return ResponseEntity.ok(ApiResponse.success("Order decision saved successfully", orderService.decideOrder(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order deleted successfully", null));
    }
}
