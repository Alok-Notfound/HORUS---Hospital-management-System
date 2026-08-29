package com.hospital.management.controller;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.service.AdmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    @PostMapping
    public ResponseEntity<Admission> createAdmission(
            @Valid @RequestBody AdmissionRequest request) {

        return ResponseEntity.ok(
                admissionService.createAdmission(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {

        return ResponseEntity.ok(
                admissionService.getAllAdmissions()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admission> getAdmissionById(
            @PathVariable Long id) {

        return admissionService.getAdmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/discharge")
    public ResponseEntity<Admission> dischargePatient(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                admissionService.dischargePatient(id)
        );
    }
}