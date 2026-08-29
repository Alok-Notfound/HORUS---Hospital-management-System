package com.hospital.management.repository;

import com.hospital.management.entity.Admission;
import com.hospital.management.entity.AdmissionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AdmissionRepository extends JpaRepository<Admission, Long> {

    Optional<Admission> findByAdmissionNumber(String admissionNumber);

    List<Admission> findByStatus(AdmissionStatus status);

    long countByStatus(AdmissionStatus status);
}