package com.hospital.management.controller;

import com.hospital.management.entity.StaffShift;
import com.hospital.management.service.StaffShiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff-shifts")
public class StaffShiftController {

    private final StaffShiftService staffShiftService;

    public StaffShiftController(
            StaffShiftService staffShiftService) {
        this.staffShiftService = staffShiftService;
    }

    @PostMapping
    public ResponseEntity<StaffShift> createShift(
            @RequestBody StaffShift shift) {

        return ResponseEntity.ok(
                staffShiftService.createShift(shift)
        );
    }

    @GetMapping
    public ResponseEntity<List<StaffShift>> getAllShifts() {

        return ResponseEntity.ok(
                staffShiftService.getAllShifts()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffShift> getShiftById(
            @PathVariable Long id) {

        return staffShiftService.getShiftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffShift> updateShift(
            @PathVariable Long id,
            @RequestBody StaffShift shift) {

        return ResponseEntity.ok(
                staffShiftService.updateShift(id, shift)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShift(
            @PathVariable Long id) {

        staffShiftService.deleteShift(id);

        return ResponseEntity.noContent().build();
    }
}