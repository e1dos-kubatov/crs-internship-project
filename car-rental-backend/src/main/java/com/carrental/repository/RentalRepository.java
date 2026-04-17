package com.carrental.repository;

import com.carrental.entity.RentalStatus;
import com.carrental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);

    boolean existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long carId,
            LocalDate endDate,
            LocalDate startDate
    );

    boolean existsByCarIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long carId,
            RentalStatus status,
            LocalDate endDate,
            LocalDate startDate
    );

    boolean existsByCarIdAndStatusInAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long carId,
            List<RentalStatus> statuses,
            LocalDate endDate,
            LocalDate startDate
    );
}
