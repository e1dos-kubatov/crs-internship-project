package com.carrental.service;

import com.carrental.dto.CarRequestDto;
import com.carrental.dto.OrderDecisionRequestDto;
import com.carrental.dto.PartnerOrderRequestDto;
import com.carrental.dto.PartnerOrderResponseDto;
import com.carrental.entity.Car;
import com.carrental.entity.OrderStatus;
import com.carrental.entity.PartnerOrder;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.repository.PartnerOrderRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final PartnerOrderRepository partnerOrderRepository;
    private final UserRepository userRepository;
    private final CarService carService;
    private final CarRepository carRepository;

    @Transactional
    public PartnerOrderResponseDto createOrder(PartnerOrderRequestDto request, String email) {
        User partner = findUserByEmail(email);
        if (partner.getRole() != Role.ROLE_PARTNER && partner.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Only partners can create car orders");
        }

        String normalizedVin = normalizeVin(request.getVin());
        partnerOrderRepository.findByVin(normalizedVin)
                .ifPresent(existingOrder -> {
                    throw new BadRequestException("An order with this VIN already exists");
                });
        carRepository.findByVin(normalizedVin)
                .ifPresent(existingCar -> {
                    throw new BadRequestException("A car with this VIN already exists");
                });

        PartnerOrder order = PartnerOrder.builder()
                .partner(partner)
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .vin(normalizedVin)
                .pricePerDay(request.getPricePerDay())
                .description(request.getDescription())
                .status(OrderStatus.PENDING)
                .build();

        return mapToResponse(partnerOrderRepository.save(order));
    }

    // NEW: Allow Partners to update their orders BEFORE they are approved
    @Transactional
    public PartnerOrderResponseDto updateOrder(Long orderId, PartnerOrderRequestDto request, String email) {
        PartnerOrder order = findOrder(orderId);

        // SECURITY CHECK: Must be Admin or Owner
        verifyOrderOwnershipOrAdmin(order, email);

        if (order.getStatus() != OrderStatus.PENDING) {
            throw new BadRequestException("You can only update PENDING orders. Since this is already processed, please update the Car directly.");
        }

        String normalizedVin = normalizeVin(request.getVin());

        // Check if VIN exists on OTHER orders/cars
        partnerOrderRepository.findByVin(normalizedVin)
                .filter(existing -> !existing.getId().equals(orderId))
                .ifPresent(existing -> { throw new BadRequestException("An order with this VIN already exists"); });
        carRepository.findByVin(normalizedVin)
                .ifPresent(existingCar -> { throw new BadRequestException("A car with this VIN already exists"); });

        order.setBrand(request.getBrand());
        order.setModel(request.getModel());
        order.setYear(request.getYear());
        order.setVin(normalizedVin);
        order.setPricePerDay(request.getPricePerDay());
        order.setDescription(request.getDescription());

        return mapToResponse(partnerOrderRepository.save(order));
    }

    public List<PartnerOrderResponseDto> getMyOrders(String email) {
        User partner = findUserByEmail(email);
        return partnerOrderRepository.findByPartnerId(partner.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PartnerOrderResponseDto> getAllOrders() {
        return partnerOrderRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public PartnerOrderResponseDto decideOrder(Long orderId, OrderDecisionRequestDto request) {
        PartnerOrder order = findOrder(orderId);
        String decision = request.getDecision().trim().toUpperCase();

        switch (decision) {
            case "APPROVE" -> approveOrder(order, request.getAdminNote());
            case "REJECT" -> rejectOrder(order, request.getAdminNote());
            default -> throw new BadRequestException("Decision must be APPROVE or REJECT");
        }

        return mapToResponse(partnerOrderRepository.save(order));
    }

    @Transactional
    // FIXED: Now requires userEmail to verify ownership
    public void deleteOrder(Long orderId, String userEmail) {
        PartnerOrder order = findOrder(orderId);

        // SECURITY CHECK: Must be Admin or Owner
        verifyOrderOwnershipOrAdmin(order, userEmail);

        if (order.getApprovedCar() != null) {
            carService.disableCar(order.getApprovedCar().getId());
        }
        partnerOrderRepository.delete(order);
    }

    private void approveOrder(PartnerOrder order, String adminNote) {
        if (order.getStatus() == OrderStatus.APPROVED) {
            throw new BadRequestException("Order is already approved");
        }

        Car createdCar = carService.createApprovedCarFromOrder(
                CarRequestDto.builder()
                        .brand(order.getBrand())
                        .model(order.getModel())
                        .year(order.getYear())
                        .vin(order.getVin())
                        .pricePerDay(order.getPricePerDay())
                        .build(),
                order.getPartner()
        );

        order.setApprovedCar(createdCar);
        order.setStatus(OrderStatus.APPROVED);
        order.setAdminNote(adminNote);
    }

    private void rejectOrder(PartnerOrder order, String adminNote) {
        order.setStatus(OrderStatus.REJECTED);
        order.setAdminNote(adminNote);
    }

    private PartnerOrder findOrder(Long orderId) {
        return partnerOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    // NEW HELPER: Verifies if the user is an Admin or the Owner of the Order
    private void verifyOrderOwnershipOrAdmin(PartnerOrder order, String userEmail) {
        User currentUser = findUserByEmail(userEmail);
        boolean isAdmin = currentUser.getRole().name().equals("ADMIN") ||
                currentUser.getRole().name().equals("ROLE_ADMIN");

        if (!isAdmin) {
            if (order.getPartner() == null || !order.getPartner().getId().equals(currentUser.getId())) {
                throw new BadRequestException("Access Denied: You can only modify your own orders!");
            }
        }
    }

    private PartnerOrderResponseDto mapToResponse(PartnerOrder order) {
        return PartnerOrderResponseDto.builder()
                .id(order.getId())
                .partnerId(order.getPartner().getId())
                .partnerName(order.getPartner().getName())
                .partnerEmail(order.getPartner().getEmail())
                .brand(order.getBrand())
                .model(order.getModel())
                .year(order.getYear())
                .vin(order.getVin())
                .pricePerDay(order.getPricePerDay())
                .description(order.getDescription())
                .status(order.getStatus())
                .adminNote(order.getAdminNote())
                .approvedCarId(order.getApprovedCar() != null ? order.getApprovedCar().getId() : null)
                .createdAt(order.getCreatedAt())
                .build();
    }

    private String normalizeVin(String vin) {
        String normalizedVin = vin == null ? "" : vin.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (normalizedVin.length() < 11 || normalizedVin.length() > 17) {
            throw new BadRequestException("VIN must be between 11 and 17 letters or digits");
        }
        return normalizedVin;
    }
}