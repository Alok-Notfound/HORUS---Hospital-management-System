package com.hospital.management.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "beds")
public class Bed {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String bedNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BedStatus status;

    @ManyToOne
    @JoinColumn(name = "ward_id", nullable = false)
    private Ward ward;

    public Bed() {
    }

    public Long getId() {
        return id;
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

    public Ward getWard() {
        return ward;
    }

    public void setWard(Ward ward) {
        this.ward = ward;
    }
}