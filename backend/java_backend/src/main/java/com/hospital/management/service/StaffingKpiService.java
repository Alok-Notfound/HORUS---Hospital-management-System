package com.hospital.management.service;

import com.hospital.management.entity.ShiftStatus;
import com.hospital.management.entity.StaffRole;
import com.hospital.management.repository.StaffRepository;
import com.hospital.management.repository.StaffShiftRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class StaffingKpiService {

    private final StaffRepository staffRepository;
    private final StaffShiftRepository staffShiftRepository;

    public StaffingKpiService(
            StaffRepository staffRepository,
            StaffShiftRepository staffShiftRepository) {

        this.staffRepository = staffRepository;
        this.staffShiftRepository = staffShiftRepository;
    }

    public Map<String, Object> getStaffingKpis() {

        long totalStaff = staffRepository.count();

        long activeStaff =
                staffRepository.countByActiveTrue();

        long doctors =
                staffRepository.countByRole(StaffRole.DOCTOR);

        long nurses =
                staffRepository.countByRole(StaffRole.NURSE);

        long activeShifts =
                staffShiftRepository.countByStatus(
                        ShiftStatus.ACTIVE);

        long scheduledShifts =
                staffShiftRepository.countByStatus(
                        ShiftStatus.SCHEDULED);

        Map<String, Object> result = new HashMap<>();

        result.put("totalStaff", totalStaff);
        result.put("activeStaff", activeStaff);
        result.put("doctors", doctors);
        result.put("nurses", nurses);
        result.put("activeShifts", activeShifts);
        result.put("scheduledShifts", scheduledShifts);

        return result;
    }
}