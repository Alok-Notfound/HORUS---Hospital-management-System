package com.hospital.management.service;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient createPatient(PatientRequest request) {

        Patient patient = new Patient();

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setPatientNumber(request.getPatientNumber());
        patient.setGender(request.getGender());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Patient updatePatient(
            Long id,
            PatientRequest request) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        patient.setFirstName(request.getFirstName());
        patient.setLastName(request.getLastName());
        patient.setPatientNumber(request.getPatientNumber());
        patient.setGender(request.getGender());
        patient.setAge(request.getAge());
        patient.setPhone(request.getPhone());

        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {

        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found");
        }

        patientRepository.deleteById(id);
    }
}