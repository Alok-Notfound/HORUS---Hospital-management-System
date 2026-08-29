package com.hospital.management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AdmissionRequest {

    @NotBlank(message = "Admission number is required")
    private String admissionNumber;

    @NotNull(message = "Patient ID is required")
    private Long patientId;

    @NotNull(message = "Bed ID is required")
    private Long bedId;

    @NotNull(message = "Admission date is required")
    private LocalDateTime admissionDate;

    public AdmissionRequest() {
    }

    public String getAdmissionNumber() {
        return admissionNumber;
    }

    public void setAdmissionNumber(String admissionNumber) {
        this.admissionNumber = admissionNumber;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getBedId() {
        return bedId;
    }

    public void setBedId(Long bedId) {
        this.bedId = bedId;
    }

    public LocalDateTime getAdmissionDate() {
        return admissionDate;
    }

    public void setAdmissionDate(LocalDateTime admissionDate) {
        this.admissionDate = admissionDate;
    }
}