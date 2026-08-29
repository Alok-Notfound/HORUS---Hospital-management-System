package com.hospital.management.service;

import com.hospital.management.dto.WardRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Ward;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.WardRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WardService {

    private final WardRepository wardRepository;
    private final DepartmentRepository departmentRepository;

    public WardService(
            WardRepository wardRepository,
            DepartmentRepository departmentRepository) {
        this.wardRepository = wardRepository;
        this.departmentRepository = departmentRepository;
    }

    public Ward createWard(WardRequest request) {

        Department department = departmentRepository.findById(
                request.getDepartmentId()
        ).orElseThrow(() ->
                new RuntimeException("Department not found"));

        Ward ward = new Ward();

        ward.setName(request.getName());
        ward.setWardType(request.getWardType());
        ward.setCapacity(request.getCapacity());
        ward.setDepartment(department);

        return wardRepository.save(ward);
    }

    public List<Ward> getAllWards() {
        return wardRepository.findAll();
    }

    public Optional<Ward> getWardById(Long id) {
        return wardRepository.findById(id);
    }

    public Ward updateWard(Long id, WardRequest request) {

        Ward ward = wardRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Ward not found"));

        Department department = departmentRepository.findById(
                request.getDepartmentId()
        ).orElseThrow(() ->
                new RuntimeException("Department not found"));

        ward.setName(request.getName());
        ward.setWardType(request.getWardType());
        ward.setCapacity(request.getCapacity());
        ward.setDepartment(department);

        return wardRepository.save(ward);
    }

    public void deleteWard(Long id) {

        if (!wardRepository.existsById(id)) {
            throw new RuntimeException("Ward not found");
        }

        wardRepository.deleteById(id);
    }
}