package com.hospital.management.controller;

import com.hospital.management.service.StaffingKpiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class StaffingKpiController {

    private final StaffingKpiService staffingKpiService;

    public StaffingKpiController(
            StaffingKpiService staffingKpiService) {

        this.staffingKpiService = staffingKpiService;
    }

    @GetMapping("/staffing")
    public ResponseEntity<Map<String, Object>> getStaffingKpis() {

        return ResponseEntity.ok(
                staffingKpiService.getStaffingKpis()
        );
    }
}