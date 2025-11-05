package com.hossain.prescription_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

@Entity
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotNull(message = "Prescription date is required")
    @Column(nullable = false)
    private LocalDate prescriptionDate;
    
    @NotBlank(message = "Patient name is required")
    @Column(nullable = false)
    private String patientName;
    
    @NotNull(message = "Patient age is required")
    @Min(value = 0, message = "Age must be at least 0")
    @Max(value = 150, message = "Age must be less than 150")
    @Column(nullable = false)
    private Integer patientAge;
    
    @NotBlank(message = "Gender is required")
    @Column(nullable = false)
    private String patientGender;
    
    @Column(columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(columnDefinition = "TEXT")
    private String medicines;
    
    private LocalDate nextVisitDate;
    
    @Column(updatable = false)
    private LocalDate createdAt = LocalDate.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDate getPrescriptionDate() { return prescriptionDate; }
    public void setPrescriptionDate(LocalDate prescriptionDate) { this.prescriptionDate = prescriptionDate; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public Integer getPatientAge() { return patientAge; }
    public void setPatientAge(Integer patientAge) { this.patientAge = patientAge; }
    
    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getMedicines() { return medicines; }
    public void setMedicines(String medicines) { this.medicines = medicines; }
    
    public LocalDate getNextVisitDate() { return nextVisitDate; }
    public void setNextVisitDate(LocalDate nextVisitDate) { this.nextVisitDate = nextVisitDate; }
    
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}