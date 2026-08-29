package com.hospital.management.service;

import com.hospital.management.entity.BedStatus;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DepartmentAnalyticsService {

    private final DepartmentRepository departmentRepository;
    private final BedRepository bedRepository;

    public DepartmentAnalyticsService(
            DepartmentRepository departmentRepository,
            BedRepository bedRepository) {

        this.departmentRepository = departmentRepository;
        this.bedRepository = bedRepository;
    }

    public Map<String, Object> getDepartmentAnalytics(
            Long departmentId) {

        if (!departmentRepository.existsById(departmentId)) {
            throw new RuntimeException("Department not found");
        }

        Map<String, Object> result = new HashMap<>();

        result.put("departmentId", departmentId);

        return result;
    }
}