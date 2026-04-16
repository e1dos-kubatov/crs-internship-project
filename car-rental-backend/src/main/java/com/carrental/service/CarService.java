package com.carrental.service;

import com.carrental.dto.CarRequestDto;
import com.carrental.dto.CarResponseDto;
import com.carrental.dto.OrderDecisionRequestDto;
import com.carrental.dto.PartnerOrderRequestDto;
import com.carrental.dto.PartnerOrderResponseDto;
import com.carrental.entity.Car;
import com.carrental.entity.OrderStatus;
import com.carrental.entity.Role;
import com.carrental.entity.User;
import com.carrental.exception.BadRequestException;
import com.carrental.exception.ResourceNotFoundException;
import com.carrental.repository.CarRepository;
import com.carrental.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CarService {

    private final CarRepository carRepository;
    private final UserRepository userRepository;

    @Transactional
    public CarResponseDto createCar(CarRequestDto request, String userEmail) {
        User owner = findUserByEmail(userEmail);
        boolean isAdmin = isAdmin(owner);

        Car car = buildNewCar(
                request,
                owner,
                isAdmin ? OrderStatus.APPROVED : OrderStatus.PENDING,
                isAdmin
        );

        return mapToResponse(carRepository.save(car));
    }

    public List<CarResponseDto> getAvailableCars() {
        return carRepository.findByAvailableTrueAndStatus(OrderStatus.APPROVED).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CarResponseDto> getAllCarsForAdmin() {
        return carRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<CarResponseDto> getCarsOwnedBy(String email) {
        User owner = findUserByEmail(email);
        return carRepository.findByOwnerId(owner.getId()).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public CarResponseDto getCarById(Long id) {
        return mapToResponse(findCarById(id));
    }

    @Transactional
    public CarResponseDto updateCar(Long id, CarRequestDto request, String userEmail) {
        Car car = findCarById(id);
        User currentUser = findUserByEmail(userEmail);

        if (!isAdmin(currentUser)) {
            verifyOwner(car, currentUser);
            car.setStatus(OrderStatus.PENDING);
            car.setAvailable(false);
            car.setAdminNote(null);
        }

        applyCarData(car, request, id);
        return mapToResponse(carRepository.save(car));
    }

    @Transactional
    public CarResponseDto approveCarVisibility(Long id) {
        Car car = findCarById(id);
        car.setStatus(OrderStatus.APPROVED);
        car.setAvailable(true);
        car.setAdminNote(null);
        return mapToResponse(carRepository.save(car));
    }

    @Transactional
    public CarResponseDto decideCar(Long id, OrderDecisionRequestDto request) {
        Car car = findCarById(id);
        String decision = request.getDecision().trim().toUpperCase();

        switch (decision) {
            case "APPROVE" -> {
                car.setStatus(OrderStatus.APPROVED);
                car.setAvailable(true);
            }
            case "REJECT" -> {
                car.setStatus(OrderStatus.REJECTED);
                car.setAvailable(false);
            }
            default -> throw new BadRequestException("Decision must be APPROVE or REJECT");
        }

        car.setAdminNote(request.getAdminNote());
        return mapToResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id, String userEmail) {
        Car car = findCarById(id);
        verifyOwnershipOrAdmin(car, userEmail);
        carRepository.delete(car);
    }

    @Transactional
    public PartnerOrderResponseDto createOrder(PartnerOrderRequestDto request, String email) {
        User owner = findPartnerOrAdmin(email);
        Car car = buildNewCar(toCarRequest(request), owner, OrderStatus.PENDING, false);
        return mapToOrderResponse(carRepository.save(car));
    }

    @Transactional
    public PartnerOrderResponseDto updateOrder(Long carId, PartnerOrderRequestDto request, String email) {
        Car car = findCarById(carId);
        verifyOwnershipOrAdmin(car, email);

        applyCarData(car, toCarRequest(request), carId);
        car.setStatus(OrderStatus.PENDING);
        car.setAvailable(false);
        car.setAdminNote(null);

        return mapToOrderResponse(carRepository.save(car));
    }

    public List<PartnerOrderResponseDto> getMyOrders(String email) {
        User owner = findUserByEmail(email);
        return carRepository.findByOwnerId(owner.getId()).stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    public List<PartnerOrderResponseDto> getAllOrders() {
        return carRepository.findAll().stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional
    public PartnerOrderResponseDto decideOrder(Long carId, OrderDecisionRequestDto request) {
        return mapToOrderResponse(findAndApplyDecision(carId, request));
    }

    @Transactional
    public void deleteOrder(Long carId, String userEmail) {
        deleteCar(carId, userEmail);
    }

    @Transactional
    public void disableCar(Long carId) {
        Car car = findCarById(carId);
        car.setAvailable(false);
        carRepository.save(car);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private User findPartnerOrAdmin(String email) {
        User user = findUserByEmail(email);
        if (user.getRole() != Role.ROLE_PARTNER && user.getRole() != Role.ROLE_ADMIN) {
            throw new BadRequestException("Only partners can create car orders");
        }
        return user;
    }

    private Car findCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
    }

    private void verifyOwnershipOrAdmin(Car car, String userEmail) {
        User currentUser = findUserByEmail(userEmail);
        if (!isAdmin(currentUser)) {
            verifyOwner(car, currentUser);
        }
    }

    private void verifyOwner(Car car, User currentUser) {
        if (car.getOwner() == null || !car.getOwner().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Access Denied: You can only modify your own cars!");
        }
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ROLE_ADMIN || user.getRole() == Role.ROLE_SUPERADMIN;
    }

    private void validateVinAvailability(String normalizedVin, Long currentCarId) {
        carRepository.findByVin(normalizedVin)
                .filter(existingCar -> currentCarId == null || !existingCar.getId().equals(currentCarId))
                .ifPresent(existingCar -> {
                    throw new BadRequestException("VIN already exists");
                });
    }

    private String normalizeVin(String vin) {
        String normalizedVin = vin == null ? "" : vin.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (normalizedVin.length() < 11 || normalizedVin.length() > 17) {
            throw new BadRequestException("VIN must be between 11 and 17 letters or digits");
        }
        return normalizedVin;
    }

    private Car buildNewCar(CarRequestDto request, User owner, OrderStatus status, boolean available) {
        String normalizedVin = normalizeVin(request.getVin());
        validateVinAvailability(normalizedVin, null);

        return Car.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .vin(normalizedVin)
                .pricePerDay(request.getPricePerDay())
                .transmission(normalizeTransmission(request.getTransmission()))
                .fuel(normalizeFuel(request.getFuel()))
                .description(request.getDescription())
                .imageUrl1(request.getImageUrl1())
                .imageUrl2(request.getImageUrl2())
                .imageUrl3(request.getImageUrl3())
                .status(status)
                .available(available)
                .owner(owner)
                .build();
    }

    private void applyCarData(Car car, CarRequestDto request, Long currentCarId) {
        String normalizedVin = normalizeVin(request.getVin());
        validateVinAvailability(normalizedVin, currentCarId);

        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setVin(normalizedVin);
        car.setPricePerDay(request.getPricePerDay());
        car.setTransmission(normalizeTransmission(request.getTransmission()));
        car.setFuel(normalizeFuel(request.getFuel()));
        car.setDescription(request.getDescription());
        car.setImageUrl1(request.getImageUrl1());
        car.setImageUrl2(request.getImageUrl2());
        car.setImageUrl3(request.getImageUrl3());
    }

    private CarRequestDto toCarRequest(PartnerOrderRequestDto request) {
        return CarRequestDto.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .vin(request.getVin())
                .pricePerDay(request.getPricePerDay())
                .transmission(request.getTransmission())
                .fuel(request.getFuel())
                .description(request.getDescription())
                .imageUrl1(request.getImageUrl1())
                .imageUrl2(request.getImageUrl2())
                .imageUrl3(request.getImageUrl3())
                .build();
    }

    private Car findAndApplyDecision(Long carId, OrderDecisionRequestDto request) {
        Car car = findCarById(carId);
        String decision = request.getDecision().trim().toUpperCase();

        switch (decision) {
            case "APPROVE" -> {
                car.setStatus(OrderStatus.APPROVED);
                car.setAvailable(true);
            }
            case "REJECT" -> {
                car.setStatus(OrderStatus.REJECTED);
                car.setAvailable(false);
            }
            default -> throw new BadRequestException("Decision must be APPROVE or REJECT");
        }

        car.setAdminNote(request.getAdminNote());
        return carRepository.save(car);
    }

    private CarResponseDto mapToResponse(Car car) {
        return CarResponseDto.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .vin(car.getVin())
                .pricePerDay(car.getPricePerDay())
                .transmission(car.getTransmission())
                .fuel(car.getFuel())
                .description(car.getDescription())
                .imageUrl1(car.getImageUrl1())
                .imageUrl2(car.getImageUrl2())
                .imageUrl3(car.getImageUrl3())
                .status(car.getStatus())
                .adminNote(car.getAdminNote())
                .available(car.isAvailable())
                .ownerId(car.getOwner() != null ? car.getOwner().getId() : null)
                .ownerName(car.getOwner() != null ? car.getOwner().getName() : null)
                .createdAt(car.getCreatedAt())
                .build();
    }

    private PartnerOrderResponseDto mapToOrderResponse(Car car) {
        return PartnerOrderResponseDto.builder()
                .id(car.getId())
                .partnerId(car.getOwner() != null ? car.getOwner().getId() : null)
                .partnerName(car.getOwner() != null ? car.getOwner().getName() : null)
                .partnerEmail(car.getOwner() != null ? car.getOwner().getEmail() : null)
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .vin(car.getVin())
                .pricePerDay(car.getPricePerDay())
                .transmission(car.getTransmission())
                .fuel(car.getFuel())
                .description(car.getDescription())
                .imageUrl1(car.getImageUrl1())
                .imageUrl2(car.getImageUrl2())
                .imageUrl3(car.getImageUrl3())
                .status(car.getStatus())
                .adminNote(car.getAdminNote())
                .approvedCarId(car.getStatus() == OrderStatus.APPROVED ? car.getId() : null)
                .createdAt(car.getCreatedAt())
                .build();
    }

    private String normalizeTransmission(String transmission) {
        String value = transmission == null ? "" : transmission.trim().toLowerCase();
        if (!value.equals("auto") && !value.equals("manual")) {
            throw new BadRequestException("Transmission must be auto or manual");
        }
        return value;
    }

    private String normalizeFuel(String fuel) {
        String value = fuel == null ? "" : fuel.trim().toLowerCase();
        if (!value.equals("gas") && !value.equals("diesel") && !value.equals("hybrid")) {
            throw new BadRequestException("Fuel must be gas, diesel, or hybrid");
        }
        return value;
    }
}
