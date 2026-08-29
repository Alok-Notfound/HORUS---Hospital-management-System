package com.hospital.management.service;

import com.hospital.management.entity.StaffShift;
import com.hospital.management.repository.StaffShiftRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffShiftService {

    private final StaffShiftRepository staffShiftRepository;

    public StaffShiftService(StaffShiftRepository staffShiftRepository) {
        this.staffShiftRepository = staffShiftRepository;
    }

    public StaffShift createShift(StaffShift shift) {
        return staffShiftRepository.save(shift);
    }

    public List<StaffShift> getAllShifts() {
        return staffShiftRepository.findAll();
    }

    public Optional<StaffShift> getShiftById(Long id) {
        return staffShiftRepository.findById(id);
    }

    public StaffShift updateShift(
            Long id,
            StaffShift shiftDetails) {

        StaffShift shift = staffShiftRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Shift not found"));

        shift.setStaff(shiftDetails.getStaff());
        shift.setShiftDate(shiftDetails.getShiftDate());
        shift.setStartTime(shiftDetails.getStartTime());
        shift.setEndTime(shiftDetails.getEndTime());
        shift.setShiftType(shiftDetails.getShiftType());
        shift.setStatus(shiftDetails.getStatus());

        return staffShiftRepository.save(shift);
    }

    public void deleteShift(Long id) {

        if (!staffShiftRepository.existsById(id)) {
            throw new RuntimeException("Shift not found");
        }

        staffShiftRepository.deleteById(id);
    }
}