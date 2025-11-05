export interface Prescription {
  id?: number;
  prescriptionDate: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  diagnosis: string;
  medicines: string;
  nextVisitDate?: string;
  createdAt?: string;
}

export interface PrescriptionResponse {
  content: Prescription[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface PrescriptionCount {
  date: string;
  count: number;
}