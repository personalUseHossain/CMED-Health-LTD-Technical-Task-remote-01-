package com.hossain.prescription_backend.service;

import com.hossain.prescription_backend.dto.PrescriptionCountDTO;
import com.hossain.prescription_backend.model.Prescription;
import com.hossain.prescription_backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    public Page<Prescription> getPrescriptionsByDateRange(
        LocalDate startDate, 
        LocalDate endDate, 
        Pageable pageable
    ) {
        return prescriptionRepository.findByPrescriptionDateBetween(startDate, endDate, pageable);
    }
    
    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }
    
    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }
    
    public Prescription updatePrescription(Long id, Prescription updatedPrescription) {
        return prescriptionRepository.findById(id)
            .map(prescription -> {
                prescription.setPrescriptionDate(updatedPrescription.getPrescriptionDate());
                prescription.setPatientName(updatedPrescription.getPatientName());
                prescription.setPatientAge(updatedPrescription.getPatientAge());
                prescription.setPatientGender(updatedPrescription.getPatientGender());
                prescription.setDiagnosis(updatedPrescription.getDiagnosis());
                prescription.setMedicines(updatedPrescription.getMedicines());
                prescription.setNextVisitDate(updatedPrescription.getNextVisitDate());
                return prescriptionRepository.save(prescription);
            })
            .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
    }
    
    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }
    
    public List<PrescriptionCountDTO> getDayWisePrescriptionCount(LocalDate startDate, LocalDate endDate) {
        return prescriptionRepository.countPrescriptionsByDateRange(startDate, endDate);
    }
}