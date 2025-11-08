import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faArrowLeft,
  faSave,
  faTimes,
  faCalendarAlt,
  faUser,
  faVenusMars,
  faStethoscope,
  faPills,
  faSpinner,
  faExclamationCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prescription-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
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
  formSubmitted = false;

  // FontAwesome Icons
  faArrowLeft = faArrowLeft;
  faSave = faSave;
  faTimes = faTimes;
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faVenusMars = faVenusMars;
  faStethoscope = faStethoscope;
  faPills = faPills;
  faSpinner = faSpinner;
  faExclamationCircle = faExclamationCircle;
  faCheckCircle = faCheckCircle;

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
        this.showError('Failed to load prescription. Please try again.');
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    
    if (!this.isFormValid()) {
      this.scrollToFirstError();
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
        this.showSuccess(
          this.isEdit 
            ? 'Prescription updated successfully!' 
            : 'Prescription created successfully!'
        );
        
        setTimeout(() => {
          this.router.navigate(['/dashboard/prescriptions']);
        }, 1500);
      },
      error: (error) => {
        console.error('Error saving prescription:', error);
        this.showError('Failed to save prescription. Please try again.');
        this.loading = false;
      }
    });
  }

  isFormValid(): boolean {
    const errors = [];
    
    if (!this.prescription.prescriptionDate) {
      errors.push('Prescription date is required');
    }
    
    if (!this.prescription.patientName?.trim()) {
      errors.push('Patient name is required');
    }
    
    if (!this.prescription.patientAge || this.prescription.patientAge < 0 || this.prescription.patientAge > 150) {
      errors.push('Valid patient age is required (0-150 years)');
    }
    
    if (!this.prescription.patientGender) {
      errors.push('Patient gender is required');
    }

    if (errors.length > 0) {
      this.errorMessage = errors.join(', ');
      return false;
    }
    
    return true;
  }

  showError(message: string) {
    this.errorMessage = message;
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      if (this.errorMessage === message) {
        this.errorMessage = '';
      }
    }, 5000);
  }

  showSuccess(message: string) {
    this.successMessage = message;
  }

  scrollToFirstError() {
    const firstErrorElement = document.querySelector('.is-invalid');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }

  onCancel() {
    this.router.navigate(['/dashboard/prescriptions']);
  }

  // Helper methods for field validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.getField(fieldName);
    return this.formSubmitted && !field.valid;
  }

  getField(fieldName: string): any {
    switch(fieldName) {
      case 'prescriptionDate':
        return { valid: !!this.prescription.prescriptionDate };
      case 'patientName':
        return { valid: !!this.prescription.patientName?.trim() };
      case 'patientAge':
        return { 
          valid: !!this.prescription.patientAge && 
                 this.prescription.patientAge >= 0 && 
                 this.prescription.patientAge <= 150 
        };
      case 'patientGender':
        return { valid: !!this.prescription.patientGender };
      default:
        return { valid: true };
    }
  }

  // Calculate max date for next visit (1 year from today)
  getMaxDate(): string {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  }

  // Calculate min date for prescription date (1 year ago)
  getMinDate(): string {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 1);
    return minDate.toISOString().split('T')[0];
  }
}