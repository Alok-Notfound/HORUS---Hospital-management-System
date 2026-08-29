package com.hospital.management.service;

import com.hospital.management.dto.BedRequest;
import com.hospital.management.entity.Bed;
import com.hospital.management.entity.Ward;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.WardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BedService {

    private final BedRepository bedRepository;
    private final WardRepository wardRepository;

    public BedService(
            BedRepository bedRepository,
            WardRepository wardRepository) {
        this.bedRepository = bedRepository;
        this.wardRepository = wardRepository;
    }

    public Bed createBed(BedRequest request) {

        Ward ward = wardRepository.findById(
                request.getWardId()
        ).orElseThrow(() ->
                new RuntimeException("Ward not found"));

        Bed bed = new Bed();

        bed.setBedNumber(request.getBedNumber());
        bed.setStatus(request.getStatus());
        bed.setWard(ward);

        return bedRepository.save(bed);
    }

    public List<Bed> getAllBeds() {
        return bedRepository.findAll();
    }

    public Optional<Bed> getBedById(Long id) {
        return bedRepository.findById(id);
    }

    public Bed updateBed(Long id, BedRequest request) {

        Bed bed = bedRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Bed not found"));

        Ward ward = wardRepository.findById(
                request.getWardId()
        ).orElseThrow(() ->
                new RuntimeException("Ward not found"));

        bed.setBedNumber(request.getBedNumber());
        bed.setStatus(request.getStatus());
        bed.setWard(ward);

        return bedRepository.save(bed);
    }

    public void deleteBed(Long id) {

        if (!bedRepository.existsById(id)) {
            throw new RuntimeException("Bed not found");
        }

        bedRepository.deleteById(id);
    }
}