package com.hospital.management.controller;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @Valid @RequestBody PatientRequest request) {

        return ResponseEntity.ok(
                patientService.createPatient(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {

        return ResponseEntity.ok(
                patientService.getAllPatients()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable Long id) {

        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable Long id,
            @Valid @RequestBody PatientRequest request) {

        return ResponseEntity.ok(
                patientService.updatePatient(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable Long id) {

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }
}