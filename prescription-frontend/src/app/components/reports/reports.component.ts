import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../services/prescription.service';
import { PrescriptionCount } from '../../models/prescription.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faChartBar,
  faCalendarAlt,
  faTimes,
  faSearch,
  faSpinner,
  faFileAlt,
  faCalendarDay,
  faChartLine,
  faTable,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  prescriptionCounts: PrescriptionCount[] = [];
  startDate: string = '';
  endDate: string = '';
  loading = false;
  errorMessage = '';

  // FontAwesome Icons
  faChartBar = faChartBar;
  faCalendarAlt = faCalendarAlt;
  faSearch = faSearch;
  faTimes = faTimes;
  faSpinner = faSpinner;
  faFileAlt = faFileAlt;
  faCalendarDay = faCalendarDay;
  faChartLine = faChartLine;
  faTable = faTable;
  faExclamationTriangle = faExclamationTriangle;

  constructor(private prescriptionService: PrescriptionService) {}

  ngOnInit() {
    this.setDefaultDateRange();
    this.loadReport();
  }

  setDefaultDateRange() {
    const today = new Date();
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(today.getDate() - 9); // Last 10 days including today
    
    this.startDate = this.formatDate(tenDaysAgo);
    this.endDate = this.formatDate(today);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  loadReport() {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = 'Please select both start and end dates';
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      this.errorMessage = 'Start date cannot be after end date';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    
    this.prescriptionService.getDayWiseCount(this.startDate, this.endDate).subscribe({
      next: (counts) => {
        this.prescriptionCounts = this.fillMissingDates(counts);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading report:', error);
        this.errorMessage = 'Failed to load report data. Please try again.';
        this.loading = false;
      }
    });
  }

  // Fill in missing dates with zero counts
  fillMissingDates(counts: PrescriptionCount[]): PrescriptionCount[] {
    const result: PrescriptionCount[] = [];
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    const dateMap = new Map();
    counts.forEach(item => {
      dateMap.set(this.formatDate(new Date(item.date)), item.count);
    });

    const current = new Date(start);
    while (current <= end) {
      const dateStr = this.formatDate(current);
      const count = dateMap.get(dateStr) || 0;
      
      result.push({
        date: dateStr,
        count: count
      });
      
      current.setDate(current.getDate() + 1);
    }

    return result;
  }

  get maxCount(): number {
    if (this.prescriptionCounts.length === 0) return 1;
    return Math.max(...this.prescriptionCounts.map(item => item.count), 1);
  }

  getBarHeight(count: number): string {
    const max = this.maxCount;
    // Ensure minimum height for visibility, maximum 95%
    const percentage = (count / max) * 95;
    return `${Math.max(percentage, 5)}%`;
  }

  getTotalPrescriptions(): number {
    return this.prescriptionCounts.reduce((total, item) => total + item.count, 0);
  }

  getAveragePerDay(): string {
    const total = this.getTotalPrescriptions();
    const daysWithData = this.prescriptionCounts.filter(item => item.count > 0).length;
    return daysWithData > 0 ? (total / daysWithData).toFixed(1) : '0';
  }

  getBusiestDay(): PrescriptionCount | null {
    if (this.prescriptionCounts.length === 0) return null;
    return this.prescriptionCounts.reduce((prev, current) => 
      (prev.count > current.count) ? prev : current
    );
  }

  getDaysWithPrescriptions(): number {
    return this.prescriptionCounts.filter(item => item.count > 0).length;
  }

  getDaysWithoutPrescriptions(): number {
    return this.prescriptionCounts.filter(item => item.count === 0).length;
  }

  getTrend(): string {
    if (this.prescriptionCounts.length < 2) return 'stable';
    
    const firstHalf = this.prescriptionCounts.slice(0, Math.floor(this.prescriptionCounts.length / 2));
    const secondHalf = this.prescriptionCounts.slice(Math.floor(this.prescriptionCounts.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, item) => sum + item.count, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.count, 0) / secondHalf.length;
    
    if (secondAvg > firstAvg * 1.1) return 'increasing';
    if (secondAvg < firstAvg * 0.9) return 'decreasing';
    return 'stable';
  }

  getTrendIcon(): string {
    const trend = this.getTrend();
    switch(trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  }

  getTrendColor(): string {
    const trend = this.getTrend();
    switch(trend) {
      case 'increasing': return 'text-success';
      case 'decreasing': return 'text-warning';
      default: return 'text-info';
    }
  }

  onDateChange() {
    // Auto-generate report when dates change (optional)
    // this.loadReport();
  }

  resetFilters() {
    this.setDefaultDateRange();
    this.loadReport();
  }
}