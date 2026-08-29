package com.hospital.management.service;

import com.hospital.management.dto.AdmissionRequest;
import com.hospital.management.entity.Admission;
import com.hospital.management.entity.AdmissionStatus;
import com.hospital.management.entity.Bed;
import com.hospital.management.entity.BedStatus;
import com.hospital.management.entity.Patient;
import com.hospital.management.repository.AdmissionRepository;
import com.hospital.management.repository.BedRepository;
import com.hospital.management.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final BedRepository bedRepository;

    public AdmissionService(
            AdmissionRepository admissionRepository,
            PatientRepository patientRepository,
            BedRepository bedRepository) {

        this.admissionRepository = admissionRepository;
        this.patientRepository = patientRepository;
        this.bedRepository = bedRepository;
    }

    public Admission createAdmission(AdmissionRequest request) {

        Patient patient = patientRepository.findById(
                request.getPatientId()
        ).orElseThrow(() ->
                new RuntimeException("Patient not found"));

        Bed bed = bedRepository.findById(
                request.getBedId()
        ).orElseThrow(() ->
                new RuntimeException("Bed not found"));

        if (bed.getStatus() != BedStatus.AVAILABLE) {
            throw new RuntimeException("Bed is not available");
        }

        Admission admission = new Admission();

        admission.setAdmissionNumber(request.getAdmissionNumber());
        admission.setPatient(patient);
        admission.setBed(bed);
        admission.setAdmissionDate(request.getAdmissionDate());
        admission.setStatus(AdmissionStatus.ADMITTED);

        bed.setStatus(BedStatus.OCCUPIED);
        bedRepository.save(bed);

        return admissionRepository.save(admission);
    }

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public Optional<Admission> getAdmissionById(Long id) {
        return admissionRepository.findById(id);
    }

    public Admission dischargePatient(Long id) {

        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Admission not found"));


        if (admission.getStatus() == AdmissionStatus.DISCHARGED) {
            throw new RuntimeException("Patient is already discharged");
        }

        admission.setStatus(AdmissionStatus.DISCHARGED);

        Bed bed = admission.getBed();

        if (bed != null) {
            bed.setStatus(BedStatus.AVAILABLE);
            bedRepository.save(bed);
        }

        return admissionRepository.save(admission);
    }
}