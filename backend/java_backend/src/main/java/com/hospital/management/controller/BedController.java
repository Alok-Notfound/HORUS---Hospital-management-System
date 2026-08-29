package com.hospital.management.controller;

import com.hospital.management.dto.BedRequest;
import com.hospital.management.entity.Bed;
import com.hospital.management.service.BedService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/beds")
public class BedController {

    private final BedService bedService;

    public BedController(BedService bedService) {
        this.bedService = bedService;
    }

    @PostMapping
    public ResponseEntity<Bed> createBed(
            @Valid @RequestBody BedRequest request) {

        return ResponseEntity.ok(
                bedService.createBed(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Bed>> getAllBeds() {

        return ResponseEntity.ok(
                bedService.getAllBeds()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bed> getBedById(
            @PathVariable Long id) {

        return bedService.getBedById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bed> updateBed(
            @PathVariable Long id,
            @Valid @RequestBody BedRequest request) {

        return ResponseEntity.ok(
                bedService.updateBed(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBed(
            @PathVariable Long id) {

        bedService.deleteBed(id);

        return ResponseEntity.noContent().build();
    }
}