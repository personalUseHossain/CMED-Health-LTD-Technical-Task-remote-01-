import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faPlus, 
  faSearch, 
  faEdit, 
  faTrash, 
  faCalendarAlt,
  faUser,
  faStethoscope,
  faCalendarCheck,
  faSpinner,
  faFileMedical,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.css']
})
export class PrescriptionListComponent implements OnInit {
  prescriptions: Prescription[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  
  // Filter properties
  startDate: string = '';
  endDate: string = '';
  
  // Loading states
  loading = false;
  deleteLoading = false;
  
  // Delete confirmation
  prescriptionToDelete: Prescription | null = null;

  // FontAwesome Icons
  faPlus = faPlus;
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faCalendarAlt = faCalendarAlt;
  faUser = faUser;
  faStethoscope = faStethoscope;
  faCalendarCheck = faCalendarCheck;
  faSpinner = faSpinner;
  faFileMedical = faFileMedical;
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPrescriptions();
    this.setDefaultDateRange();
  }

  setDefaultDateRange() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    
    this.startDate = this.formatDate(firstDay);
    this.endDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadPrescriptions() {
    this.loading = true;
    this.prescriptionService.getPrescriptions(
      this.startDate, 
      this.endDate, 
      this.currentPage, 
      this.pageSize
    ).subscribe({
      next: (response) => {
        this.prescriptions = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading prescriptions:', error);
        this.loading = false;
        // You can add a toast notification here
      }
    });
  }

  onFilter() {
    this.currentPage = 0;
    this.loadPrescriptions();
  }

  onPageChange(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadPrescriptions();
      // Scroll to top of the list
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onEdit(prescription: Prescription) {
    this.router.navigate(['/dashboard/prescriptions/edit', prescription.id]);
  }

  onDelete(prescription: Prescription) {
    this.prescriptionToDelete = prescription;
  }

  confirmDelete() {
    if (this.prescriptionToDelete && this.prescriptionToDelete.id) {
      this.deleteLoading = true;
      this.prescriptionService.deletePrescription(this.prescriptionToDelete.id).subscribe({
        next: () => {
          this.loadPrescriptions();
          this.prescriptionToDelete = null;
          this.deleteLoading = false;
          // Show success message
        },
        error: (error) => {
          console.error('Error deleting prescription:', error);
          this.prescriptionToDelete = null;
          this.deleteLoading = false;
          // Show error message
        }
      });
    }
  }

  cancelDelete() {
    this.prescriptionToDelete = null;
  }

  isUpcoming(dateString: string): boolean {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(dateString);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate > today;
  }

  isToday(dateString: string): boolean {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(dateString);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate.getTime() === today.getTime();
  }

  isPast(dateString: string): boolean {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(dateString);
    visitDate.setHours(0, 0, 0, 0);
    return visitDate < today;
  }

  get pages(): number[] {
    const pagesToShow = 5;
    const startPage = Math.max(0, this.currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(this.totalPages - 1, startPage + pagesToShow - 1);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getDisplayRange(): string {
    const start = this.currentPage * this.pageSize + 1;
    const end = Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
    return `Showing ${start}-${end} of ${this.totalElements} prescriptions`;
  }
}