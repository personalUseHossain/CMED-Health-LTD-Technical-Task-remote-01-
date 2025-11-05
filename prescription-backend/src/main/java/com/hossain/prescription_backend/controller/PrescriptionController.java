package com.hossain.prescription_backend.controller;

import com.hossain.prescription_backend.dto.PrescriptionCountDTO;
import com.hossain.prescription_backend.model.Prescription;
import com.hossain.prescription_backend.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/prescription")
@CrossOrigin(origins = "http://localhost:4200")
public class PrescriptionController {
    
    @Autowired
    private PrescriptionService prescriptionService;
    
    @GetMapping
    public ResponseEntity<Page<Prescription>> getPrescriptions(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        if (startDate == null) {
            startDate = LocalDate.now().withDayOfMonth(1);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("prescriptionDate").descending());
        Page<Prescription> prescriptions = prescriptionService.getPrescriptionsByDateRange(
            startDate, endDate, pageable
        );
        return ResponseEntity.ok(prescriptions);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createPrescription(@Valid @RequestBody Prescription prescription) {
        try {
            Prescription saved = prescriptionService.createPrescription(prescription);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating prescription: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePrescription(
        @PathVariable Long id, 
        @Valid @RequestBody Prescription prescription
    ) {
        try {
            Prescription updated = prescriptionService.updatePrescription(id, prescription);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePrescription(@PathVariable Long id) {
        try {
            prescriptionService.deletePrescription(id);
            return ResponseEntity.ok("Prescription deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting prescription");
        }
    }
    
    @GetMapping("/report/day-wise-count")
    public ResponseEntity<List<PrescriptionCountDTO>> getDayWiseCount(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        if (startDate == null) {
            startDate = LocalDate.now().minusDays(10);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }
        
        List<PrescriptionCountDTO> counts = prescriptionService.getDayWisePrescriptionCount(
            startDate, endDate
        );
        return ResponseEntity.ok(counts);
    }
}