import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription } from '../../models/prescription.model';

@Component({
  selector: 'app-prescription-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.css']
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
  deleteLoading = false; // Added missing property
  
  // Delete confirmation
  prescriptionToDelete: Prescription | null = null;

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
      }
    });
  }

  onFilter() {
    this.currentPage = 0;
    this.loadPrescriptions();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadPrescriptions();
  }

  onEdit(prescription: Prescription) {
    this.router.navigate(['/dashboard/prescriptions/edit', prescription.id]);
  }

  onDelete(prescription: Prescription) {
    this.prescriptionToDelete = prescription;
  }

  confirmDelete() {
    if (this.prescriptionToDelete && this.prescriptionToDelete.id) {
      this.deleteLoading = true; // Set delete loading state
      this.prescriptionService.deletePrescription(this.prescriptionToDelete.id).subscribe({
        next: () => {
          this.loadPrescriptions();
          this.prescriptionToDelete = null;
          this.deleteLoading = false;
        },
        error: (error) => {
          console.error('Error deleting prescription:', error);
          this.prescriptionToDelete = null;
          this.deleteLoading = false;
        }
      });
    }
  }

  cancelDelete() {
    this.prescriptionToDelete = null;
  }

  // Added missing methods for date comparisons
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

  get pages(): number[] {
    // Show only relevant pages (current page ± 2)
    const startPage = Math.max(0, this.currentPage - 2);
    const endPage = Math.min(this.totalPages - 1, this.currentPage + 2);
    
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}