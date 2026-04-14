package com.carrental.service;

import com.carrental.dto.RentalRequestDto;
import com.carrental.dto.RentalResponseDto;
import com.carrental.entity.Car;
import com.carrental.entity.Rental;
import com.carrental.entity.RentalStatus;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.repository.RentalRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RentalService {

    private final RentalRepository rentalRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional
    public RentalResponseDto createRental(RentalRequestDto request, String userEmail) {
        validateDates(request.getStartDate(), request.getEndDate());

        Car car = carRepository.findById(request.getCarId())
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
        User user = findUserByEmail(userEmail);

        if (!car.isAvailable()) {
            throw new BadRequestException("This car is not available for rent");
        }
        if (car.getOwner() != null && car.getOwner().getId().equals(user.getId())) {
            throw new BadRequestException("You cannot rent your own car");
        }

        boolean overlaps = rentalRepository.existsByCarIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                car.getId(),
                RentalStatus.ACTIVE,
                request.getEndDate(),
                request.getStartDate()
        );
        if (overlaps) {
            throw new BadRequestException("Car is already booked for the selected dates");
        }

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal totalPrice = car.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Rental rental = Rental.builder()
                .user(user)
                .car(car)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .totalPrice(totalPrice)
                .status(RentalStatus.ACTIVE)
                .build();

        return mapToResponse(rentalRepository.save(rental));
    }

    public List<RentalResponseDto> getUserRentals(String userEmail) {
        User user = findUserByEmail(userEmail);
        return rentalRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<RentalResponseDto> getAllRentals() {
        return rentalRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public RentalResponseDto updateRentalStatus(Long rentalId, String statusValue) {
        Rental rental = rentalRepository.findById(rentalId)
                .orElseThrow(() -> new ResourceNotFoundException("Rental not found"));

        RentalStatus status;
        try {
            status = RentalStatus.valueOf(statusValue.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid rental status");
        }

        rental.setStatus(status);
        return mapToResponse(rentalRepository.save(rental));
    }

    private RentalResponseDto mapToResponse(Rental rental) {
        return RentalResponseDto.builder()
                .id(rental.getId())
                .userId(rental.getUser().getId())
                .userEmail(rental.getUser().getEmail())
                .carId(rental.getCar().getId())
                .carBrand(rental.getCar().getBrand())
                .carModel(rental.getCar().getModel())
                .startDate(rental.getStartDate())
                .endDate(rental.getEndDate())
                .totalPrice(rental.getTotalPrice())
                .status(rental.getStatus())
                .createdAt(rental.getCreatedAt())
                .build();
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date must be after or equal to start date");
        }
    }
}
