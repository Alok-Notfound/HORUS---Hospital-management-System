package com.hospital.management.repository;

import com.hospital.management.entity.Staff;
import com.hospital.management.entity.StaffRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByEmployeeNumber(String employeeNumber);

    List<Staff> findByRole(StaffRole role);

    List<Staff> findByActiveTrue();

    long countByActiveTrue();

    long countByRole(StaffRole role);
}