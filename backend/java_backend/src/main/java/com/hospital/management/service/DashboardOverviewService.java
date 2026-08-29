package com.hospital.management.service;

import com.hospital.management.entity.AdmissionStatus;
import com.hospital.management.entity.BedStatus;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.BedRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardOverviewService {

    private final BedRepository bedRepository;
    private final AdmissionRepository admissionRepository;

    public DashboardOverviewService(
            BedRepository bedRepository,
            AdmissionRepository admissionRepository) {

        this.bedRepository = bedRepository;
        this.admissionRepository = admissionRepository;
    }

    public Map<String, Object> getOverview() {

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

        long totalAdmissions = admissionRepository.count();

        long activeAdmissions =
                admissionRepository.countByStatus(
                        AdmissionStatus.ADMITTED);

        long dischargedPatients =
                admissionRepository.countByStatus(
                        AdmissionStatus.DISCHARGED);

        long transferredPatients =
                admissionRepository.countByStatus(
                        AdmissionStatus.TRANSFERRED);

        Map<String, Object> result = new HashMap<>();

        result.put("totalBeds", totalBeds);
        result.put("availableBeds", availableBeds);
        result.put("occupiedBeds", occupiedBeds);
        result.put("reservedBeds", reservedBeds);
        result.put("maintenanceBeds", maintenanceBeds);
        result.put("occupancyPercentage", occupancyPercentage);

        result.put("totalAdmissions", totalAdmissions);
        result.put("activeAdmissions", activeAdmissions);
        result.put("dischargedPatients", dischargedPatients);
        result.put("transferredPatients", transferredPatients);

        return result;
    }
}