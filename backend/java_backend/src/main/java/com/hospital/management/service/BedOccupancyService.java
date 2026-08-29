package com.hospital.management.service;

import com.hospital.management.entity.BedStatus;
import com.hospital.management.repository.BedRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class BedOccupancyService {

    private final BedRepository bedRepository;

    public BedOccupancyService(BedRepository bedRepository) {
        this.bedRepository = bedRepository;
    }

    public Map<String, Object> getBedOccupancy() {

        long totalBeds = bedRepository.count();

        long availableBeds =
                bedRepository.countByStatus(BedStatus.AVAILABLE);

        long occupiedBeds =
                bedRepository.countByStatus(BedStatus.OCCUPIED);

        long reservedBeds =
                bedRepository.countByStatus(BedStatus.RESERVED);

        long maintenanceBeds =
                bedRepository.countByStatus(BedStatus.MAINTENANCE);

        double occupancyPercentage = 0;

        if (totalBeds > 0) {
            occupancyPercentage =
                    ((double) occupiedBeds / totalBeds) * 100;
        }

        Map<String, Object> result = new HashMap<>();

        result.put("totalBeds", totalBeds);
        result.put("availableBeds", availableBeds);
        result.put("occupiedBeds", occupiedBeds);
        result.put("reservedBeds", reservedBeds);
        result.put("maintenanceBeds", maintenanceBeds);
        result.put("occupancyPercentage", occupancyPercentage);

        return result;
    }

    public Map<String, Object> getWardOccupancy(Long wardId) {

        long totalBeds =
                bedRepository.countByWardId(wardId);

        long availableBeds =
                bedRepository.countByWardIdAndStatus(
                        wardId,
                        BedStatus.AVAILABLE
                );

        long occupiedBeds =
                bedRepository.countByWardIdAndStatus(
                        wardId,
                        BedStatus.OCCUPIED
                );

        long reservedBeds =
                bedRepository.countByWardIdAndStatus(
                        wardId,
                        BedStatus.RESERVED
                );

        long maintenanceBeds =
                bedRepository.countByWardIdAndStatus(
                        wardId,
                        BedStatus.MAINTENANCE
                );

        double occupancyPercentage = 0;

        if (totalBeds > 0) {
            occupancyPercentage =
                    ((double) occupiedBeds / totalBeds) * 100;
        }

        Map<String, Object> result = new HashMap<>();

        result.put("wardId", wardId);
        result.put("totalBeds", totalBeds);
        result.put("availableBeds", availableBeds);
        result.put("occupiedBeds", occupiedBeds);
        result.put("reservedBeds", reservedBeds);
        result.put("maintenanceBeds", maintenanceBeds);
        result.put("occupancyPercentage", occupancyPercentage);

        return result;
    }
}