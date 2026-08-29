package com.hospital.management.service;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AIInsightService {

    public String generateInsight(Map<String, Object> hospitalData) {

        Number occupancy =
                (Number) hospitalData.get("occupancyPercentage");

        Number admissions =
                (Number) hospitalData.get("activeAdmissions");

        Number availableBeds =
                (Number) hospitalData.get("availableBeds");

        if (occupancy != null &&
                occupancy.doubleValue() >= 90) {

            return "Hospital occupancy is critically high. "
                    + "Review discharge-ready patients and "
                    + "consider reallocating available beds.";
        }

        if (availableBeds != null &&
                availableBeds.longValue() <= 5) {

            return "Available bed capacity is low. "
                    + "Operations should review current bed "
                    + "allocation and expected discharges.";
        }

        if (admissions != null &&
                admissions.longValue() > 50) {

            return "Active admissions are high. "
                    + "Review patient flow and staffing capacity.";
        }

        return "Hospital operations are currently within "
                + "normal capacity ranges.";
    }
}