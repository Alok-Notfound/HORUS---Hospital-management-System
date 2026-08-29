package com.hospital.management.repository;
import com.hospital.management.entity.BedStatus;
import com.hospital.management.entity.Bed;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BedRepository extends JpaRepository<Bed, Long> {

    long countByStatus(BedStatus status);
    long countByWardId(Long wardId);

    long countByWardIdAndStatus(Long wardId, BedStatus status);


}