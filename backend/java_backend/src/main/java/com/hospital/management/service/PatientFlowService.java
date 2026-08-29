package com.hospital.management.service;

import com.hospital.management.entity.AdmissionStatus;
import com.hospital.management.repository.AdmissionRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class PatientFlowService {

    private final AdmissionRepository admissionRepository;

    public PatientFlowService(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    public Map<String, Object> getPatientFlow() {

        long totalAdmissions = admissionRepository.count();

        long activeAdmissions =
                admissionRepository.countByStatus(
                        AdmissionStatus.ADMITTED);

        long dischargedPatients =
                admissionRepository.countByStatus(
                        AdmissionStatus.DISCHARGED);

        long transferredPatients =
                admissionRepository.countByStatus(
                        AdmissionStatus.TRANSFERRED);

        Map<String, Object> result = new HashMap<>();

        result.put("totalAdmissions", totalAdmissions);
        result.put("activeAdmissions", activeAdmissions);
        result.put("dischargedPatients", dischargedPatients);
        result.put("transferredPatients", transferredPatients);

        return result;
    }
}