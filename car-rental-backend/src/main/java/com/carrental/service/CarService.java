package com.carrental.service;

import com.carrental.dto.CarRequestDto;
import com.carrental.dto.CarResponseDto;
import com.carrental.entity.Car;
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
    public CarResponseDto createCar(CarRequestDto request) {
        String normalizedVin = normalizeVin(request.getVin());
        validateVinAvailability(normalizedVin, null);
        Car car = Car.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .vin(normalizedVin)
                .pricePerDay(request.getPricePerDay())
                .available(true)
                .build();
        return mapToResponse(carRepository.save(car));
    }

    public List<CarResponseDto> getAvailableCars() {
        return carRepository.findByAvailableTrue().stream()
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
    public CarResponseDto updateCar(Long id, CarRequestDto request) {
        Car car = findCarById(id);
        String normalizedVin = normalizeVin(request.getVin());
        validateVinAvailability(normalizedVin, id);
        car.setBrand(request.getBrand());
        car.setModel(request.getModel());
        car.setYear(request.getYear());
        car.setVin(normalizedVin);
        car.setPricePerDay(request.getPricePerDay());
        return mapToResponse(carRepository.save(car));
    }

    @Transactional
    public void deleteCar(Long id) {
        carRepository.delete(findCarById(id));
    }

    @Transactional
    public Car createApprovedCarFromOrder(CarRequestDto request, User owner) {
        String normalizedVin = normalizeVin(request.getVin());
        validateVinAvailability(normalizedVin, null);
        Car car = Car.builder()
                .brand(request.getBrand())
                .model(request.getModel())
                .year(request.getYear())
                .vin(normalizedVin)
                .pricePerDay(request.getPricePerDay())
                .owner(owner)
                .available(true)
                .build();
        return carRepository.save(car);
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

    private Car findCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found"));
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

    private CarResponseDto mapToResponse(Car car) {
        return CarResponseDto.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .year(car.getYear())
                .vin(car.getVin())
                .pricePerDay(car.getPricePerDay())
                .available(car.isAvailable())
                .ownerId(car.getOwner() != null ? car.getOwner().getId() : null)
                .ownerName(car.getOwner() != null ? car.getOwner().getName() : null)
                .build();
    }
}
