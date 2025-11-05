package com.hossain.prescription_backend.repository;

import com.hossain.prescription_backend.model.Prescription;
import com.hossain.prescription_backend.dto.PrescriptionCountDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    Page<Prescription> findByPrescriptionDateBetween(
        LocalDate startDate, 
        LocalDate endDate, 
        Pageable pageable
    );
    
    @Query("SELECT new com.hossain.prescription_backend.dto.PrescriptionCountDTO(p.prescriptionDate, COUNT(p)) " +
           "FROM Prescription p " +
           "WHERE p.prescriptionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY p.prescriptionDate " +
           "ORDER BY p.prescriptionDate")
    List<PrescriptionCountDTO> countPrescriptionsByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}