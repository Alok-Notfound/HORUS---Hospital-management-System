package com.hospital.management.dto;

import com.hospital.management.entity.BedStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BedRequest {

    @NotBlank(message = "Bed number is required")
    private String bedNumber;

    @NotNull(message = "Bed status is required")
    private BedStatus status;

    @NotNull(message = "Ward ID is required")
    private Long wardId;

    public BedRequest() {
    }

    public String getBedNumber() {
        return bedNumber;
    }

    public void setBedNumber(String bedNumber) {
        this.bedNumber = bedNumber;
    }

    public BedStatus getStatus() {
        return status;
    }

    public void setStatus(BedStatus status) {
        this.status = status;
    }

    public Long getWardId() {
        return wardId;
    }

    public void setWardId(Long wardId) {
        this.wardId = wardId;
    }
}