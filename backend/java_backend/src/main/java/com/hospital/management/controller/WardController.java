package com.hospital.management.controller;

import com.hospital.management.dto.WardRequest;
import com.hospital.management.entity.Ward;
import com.hospital.management.service.WardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
public class WardController {

    private final WardService wardService;

    public WardController(WardService wardService) {
        this.wardService = wardService;
    }

    @PostMapping
    public ResponseEntity<Ward> createWard(
            @Valid @RequestBody WardRequest request) {

        return ResponseEntity.ok(
                wardService.createWard(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<Ward>> getAllWards() {

        return ResponseEntity.ok(
                wardService.getAllWards()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ward> getWardById(
            @PathVariable Long id) {

        return wardService.getWardById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Ward> updateWard(
            @PathVariable Long id,
            @Valid @RequestBody WardRequest request) {

        return ResponseEntity.ok(
                wardService.updateWard(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWard(
            @PathVariable Long id) {

        wardService.deleteWard(id);

        return ResponseEntity.noContent().build();
    }
}