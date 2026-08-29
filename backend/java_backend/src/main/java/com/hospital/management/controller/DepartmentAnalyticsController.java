package com.hospital.management.controller;

import com.hospital.management.service.DepartmentAnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DepartmentAnalyticsController {

    private final DepartmentAnalyticsService departmentAnalyticsService;

    public DepartmentAnalyticsController(
            DepartmentAnalyticsService departmentAnalyticsService) {

        this.departmentAnalyticsService =
                departmentAnalyticsService;
    }

    @GetMapping("/departments/{departmentId}")
    public ResponseEntity<Map<String, Object>> getDepartmentAnalytics(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                departmentAnalyticsService
                        .getDepartmentAnalytics(departmentId)
        );
    }
}