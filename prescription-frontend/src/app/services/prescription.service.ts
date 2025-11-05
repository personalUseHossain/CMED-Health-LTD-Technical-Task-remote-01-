import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription, PrescriptionResponse, PrescriptionCount } from '../models/prescription.model';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:8080/api/v1/prescription';

  constructor(private http: HttpClient) {}

  getPrescriptions(startDate?: string, endDate?: string, page: number = 0, size: number = 10): Observable<PrescriptionResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<PrescriptionResponse>(this.apiUrl, { params });
  }

  getPrescriptionById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/${id}`);
  }

  createPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(this.apiUrl, prescription);
  }

  updatePrescription(id: number, prescription: Prescription): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/${id}`, prescription);
  }

  deletePrescription(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getDayWiseCount(startDate?: string, endDate?: string): Observable<PrescriptionCount[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<PrescriptionCount[]>(`${this.apiUrl}/report/day-wise-count`, { params });
  }
}