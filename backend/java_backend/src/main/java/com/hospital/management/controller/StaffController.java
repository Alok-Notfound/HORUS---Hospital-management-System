package com.hospital.management.controller;

import com.hospital.management.dto.StaffRequest;
import com.hospital.management.entity.Staff;
import com.hospital.management.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
public class StaffController {

    private final StaffService staffService;

    public StaffController(StaffService staffService) {
        this.staffService = staffService;
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.createStaff(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {

        return ResponseEntity.ok(
                staffService.getAllStaff()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(
            @PathVariable Long id) {

        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(
            @PathVariable Long id,
            @Valid @RequestBody StaffRequest request) {

        return ResponseEntity.ok(
                staffService.updateStaff(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(
            @PathVariable Long id) {

        staffService.deleteStaff(id);

        return ResponseEntity.noContent().build();
    }
}