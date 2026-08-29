package com.hospital.management.controller;

import com.hospital.management.service.AIInsightService;
import com.hospital.management.service.DashboardOverviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIInsightController {

    private final AIInsightService aiInsightService;
    private final DashboardOverviewService dashboardOverviewService;

    public AIInsightController(
            AIInsightService aiInsightService,
            DashboardOverviewService dashboardOverviewService) {

        this.aiInsightService = aiInsightService;
        this.dashboardOverviewService =
                dashboardOverviewService;
    }

    @GetMapping("/hospital-insight")
    public ResponseEntity<Map<String, Object>> getHospitalInsight() {

        Map<String, Object> hospitalData =
                dashboardOverviewService.getOverview();

        String insight =
                aiInsightService.generateInsight(hospitalData);

        return ResponseEntity.ok(
                Map.of(
                        "insight", insight,
                        "data", hospitalData
                )
        );
    }
}