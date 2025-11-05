import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.css']
})
export class PrescriptionFormComponent implements OnInit {
  prescription: Prescription = {
    prescriptionDate: '',
    patientName: '',
    patientAge: 0,
    patientGender: '',
    diagnosis: '',
    medicines: '',
    nextVisitDate: ''
  };

  isEdit = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private prescriptionService: PrescriptionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadPrescription(Number(id));
    } else {
      // Set default date to today for new prescriptions
      this.prescription.prescriptionDate = new Date().toISOString().split('T')[0];
    }
  }

  loadPrescription(id: number) {
    this.loading = true;
    this.prescriptionService.getPrescriptionById(id).subscribe({
      next: (prescription) => {
        this.prescription = prescription;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading prescription:', error);
        this.errorMessage = 'Failed to load prescription';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const operation = this.isEdit 
      ? this.prescriptionService.updatePrescription(this.prescription.id!, this.prescription)
      : this.prescriptionService.createPrescription(this.prescription);

    operation.subscribe({
      next: () => {
        this.successMessage = this.isEdit 
          ? 'Prescription updated successfully!' 
          : 'Prescription created successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/prescriptions']);
        }, 1000);
      },
      error: (error) => {
        console.error('Error saving prescription:', error);
        this.errorMessage = 'Failed to save prescription. Please try again.';
        this.loading = false;
      }
    });
  }

  isFormValid(): boolean {
    if (!this.prescription.prescriptionDate) {
      this.errorMessage = 'Prescription date is required';
      return false;
    }
    if (!this.prescription.patientName?.trim()) {
      this.errorMessage = 'Patient name is required';
      return false;
    }
    if (!this.prescription.patientAge || this.prescription.patientAge < 0 || this.prescription.patientAge > 150) {
      this.errorMessage = 'Valid patient age is required (0-150)';
      return false;
    }
    if (!this.prescription.patientGender) {
      this.errorMessage = 'Patient gender is required';
      return false;
    }
    return true;
  }

  onCancel() {
    this.router.navigate(['/dashboard/prescriptions']);
  }
}