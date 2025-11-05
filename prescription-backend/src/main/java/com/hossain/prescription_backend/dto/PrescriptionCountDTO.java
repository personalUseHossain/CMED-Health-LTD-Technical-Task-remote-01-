package com.hossain.prescription_backend.dto;

import java.time.LocalDate;

public class PrescriptionCountDTO {
    private LocalDate date;
    private Long count;

    // Constructors
    public PrescriptionCountDTO() {}
    
    public PrescriptionCountDTO(LocalDate date, Long count) {
        this.date = date;
        this.count = count;
    }

    // Getters and Setters
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public Long getCount() { return count; }
    public void setCount(Long count) { this.count = count; }
}