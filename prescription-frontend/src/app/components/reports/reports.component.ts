import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { Prescription, PrescriptionCount } from '../../models/prescription.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  prescriptionCounts: PrescriptionCount[] = [];
  startDate: string = '';
  endDate: string = '';
  loading = false;

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit() {
    this.setDefaultDateRange();
    this.loadReport();
  }

  setDefaultDateRange() {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 10);
    
    this.startDate = this.formatDate(tenDaysAgo);
    this.endDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadReport() {
    this.loading = true;
    this.prescriptionService.getDayWiseCount(this.startDate, this.endDate).subscribe({
      next: (counts) => {
        this.prescriptionCounts = counts;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading report:', error);
        this.loading = false;
      }
    });
  }

  get maxCount(): number {
    return Math.max(...this.prescriptionCounts.map(item => item.count), 1);
  }

  getBarHeight(count: number): string {
    const max = this.maxCount;
    return `${(count / max) * 100}%`;
  }

  // Helper methods to fix template errors
  getTotalPrescriptions(): number {
    return this.prescriptionCounts.reduce((total, item) => total + item.count, 0);
  }

  getAveragePerDay(): string {
    const total = this.getTotalPrescriptions();
    return (total / this.prescriptionCounts.length).toFixed(1);
  }

  getBusiestDayDate(): string {
    const busiest = this.prescriptionCounts.find(item => item.count === this.maxCount);
    return busiest ? (new Date(busiest.date)).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }) : '';
  }
}