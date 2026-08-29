package com.hospital.management.service;

import com.hospital.management.dto.StaffRequest;
import com.hospital.management.entity.Department;
import com.hospital.management.entity.Staff;
import com.hospital.management.repository.DepartmentRepository;
import com.hospital.management.repository.StaffRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    private final StaffRepository staffRepository;
    private final DepartmentRepository departmentRepository;

    public StaffService(
            StaffRepository staffRepository,
            DepartmentRepository departmentRepository) {

        this.staffRepository = staffRepository;
        this.departmentRepository = departmentRepository;
    }

    public Staff createStaff(StaffRequest request) {

        Staff staff = new Staff();

        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setEmployeeNumber(request.getEmployeeNumber());
        staff.setRole(request.getRole());
        staff.setActive(request.getActive());

        if (request.getDepartmentId() != null) {

            Department department = departmentRepository.findById(
                    request.getDepartmentId()
            ).orElseThrow(() ->
                    new RuntimeException("Department not found"));

            staff.setDepartment(department);
        }

        return staffRepository.save(staff);
    }

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public Staff updateStaff(Long id, StaffRequest request) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Staff not found"));

        staff.setFirstName(request.getFirstName());
        staff.setLastName(request.getLastName());
        staff.setEmployeeNumber(request.getEmployeeNumber());
        staff.setRole(request.getRole());
        staff.setActive(request.getActive());

        if (request.getDepartmentId() != null) {

            Department department = departmentRepository.findById(
                    request.getDepartmentId()
            ).orElseThrow(() ->
                    new RuntimeException("Department not found"));

            staff.setDepartment(department);
        } else {
            staff.setDepartment(null);
        }

        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {

        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Staff not found");
        }

        staffRepository.deleteById(id);
    }
}