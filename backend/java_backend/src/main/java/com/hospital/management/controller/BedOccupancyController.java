package com.hospital.management.controller;

import com.hospital.management.service.BedOccupancyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class BedOccupancyController {

    private final BedOccupancyService bedOccupancyService;

    public BedOccupancyController(
            BedOccupancyService bedOccupancyService) {

        this.bedOccupancyService = bedOccupancyService;
    }

    @GetMapping("/bed-occupancy")
    public ResponseEntity<Map<String, Object>> getBedOccupancy() {

        return ResponseEntity.ok(
                bedOccupancyService.getBedOccupancy()
        );
    }

    @GetMapping("/wards/{wardId}/occupancy")
    public ResponseEntity<Map<String, Object>> getWardOccupancy(
            @PathVariable Long wardId) {

        return ResponseEntity.ok(
                bedOccupancyService.getWardOccupancy(wardId)
        );
    }
}