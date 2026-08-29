package com.hospital.management.repository;

import com.hospital.management.entity.ShiftStatus;
import com.hospital.management.entity.StaffShift;
import com.hospital.management.entity.ShiftType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface StaffShiftRepository
        extends JpaRepository<StaffShift, Long> {

    List<StaffShift> findByShiftDate(LocalDate shiftDate);

    List<StaffShift> findByStatus(ShiftStatus status);

    List<StaffShift> findByShiftType(ShiftType shiftType);

    long countByStatus(ShiftStatus status);
}