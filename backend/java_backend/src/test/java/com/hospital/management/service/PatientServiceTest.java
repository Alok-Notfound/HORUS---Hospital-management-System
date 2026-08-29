package com.hospital.management.service;

import com.hospital.management.dto.PatientRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    private PatientRepository patientRepository;

    @InjectMocks
    private PatientService patientService;

    @Test
    void shouldCreatePatient() {

        PatientRequest request = new PatientRequest();

        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPatientNumber("P001");
        request.setGender("MALE");
        request.setAge(35);
        request.setPhone("9999999999");

        Patient patient = new Patient();

        patient.setFirstName("John");
        patient.setLastName("Doe");

        when(patientRepository.save(any(Patient.class)))
                .thenReturn(patient);

        Patient result =
                patientService.createPatient(request);

        assertEquals("John", result.getFirstName());
        assertEquals("Doe", result.getLastName());

        verify(patientRepository).save(any(Patient.class));
    }

    @Service
    public static class PatientService {

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

        public Patient updatePatient(Long id, PatientRequest request) {

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
}