package com.hospital.management.controller;

import com.hospital.management.service.DashboardOverviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardOverviewController {

    private final DashboardOverviewService dashboardOverviewService;

    public DashboardOverviewController(
            DashboardOverviewService dashboardOverviewService) {

        this.dashboardOverviewService = dashboardOverviewService;
    }

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {

        return ResponseEntity.ok(
                dashboardOverviewService.getOverview()
        );
    }
}