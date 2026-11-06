/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - HMIS Type Definitions
 */

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type Genotype = 'AA' | 'AS' | 'SS' | 'AC';
export type BillingType = 'Self-Pay (Cash/Mobile Money)' | 'National Health / Insurance' | 'Corporate Partner' | 'Agape Subsidized Care';
export type PatientStatus = 'Outpatient' | 'Inpatient' | 'Emergency' | 'Discharged';

export interface Patient {
  id: string;
  hospitalNumber: string; // e.g. RAMC-26-0042
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  phone: string;
  address: string;
  bloodGroup: BloodGroup;
  genotype: Genotype;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  billingType: BillingType;
  status: PatientStatus;
  isMaternalANC: boolean;
  ancDetails?: {
    gravida: number;
    para: number;
    gestationalWeeks: number;
    edd: string; // Expected delivery date
    riskLevel: 'Low' | 'Moderate' | 'High';
    lastScanDate?: string;
  };
  registeredAt: string;
  lastVisitDate: string;
}

export type TriageCategory = 'Emergency (Immediate)' | 'Urgent (15-30m)' | 'Standard (OPD)' | 'Non-Urgent';

export interface VitalSigns {
  id: string;
  patientId: string;
  timestamp: string;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  heartRate: number;
  temperature: number; // Celsius
  respiratoryRate: number;
  spo2: number; // %
  bloodGlucose?: number; // mg/dL
  weightKg: number;
  heightCm: number;
  bmi: number;
  painScore: number; // 0-10
  triageCategory: TriageCategory;
  clinicalNote?: string;
  recordedBy: string;
}

export interface PrescriptionItem {
  id: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  unitPriceNle: number;
  quantity: number;
  isDispensed: boolean;
  instructions: string;
}

export interface ClinicalEncounter {
  id: string;
  patientId: string;
  date: string;
  department: string;
  doctorName: string;
  subjective: string; // Chief complaint & history
  objective: string; // Physical exam & vitals
  assessment: string; // Diagnosis
  icdCode?: string;
  plan: string; // Management plan
  prescriptions: PrescriptionItem[];
  labOrders: string[];
  ultrasoundOrder?: string;
  followUpDate?: string;
}

export type AppointmentStatus = 'Scheduled' | 'Checked In' | 'In Consultation' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientHospitalNumber: string;
  patientPhone: string;
  department: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  reason: string;
  type: 'General OPD' | 'ANC Checkup' | 'Ultrasound Scan' | 'Emergency / Trauma' | 'Internal Medicine' | 'Pediatric' | 'Lab Testing';
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface UltrasoundFinding {
  gestationalAgeWeeks?: number;
  edd?: string;
  fetalHeartRateBpm?: number;
  fetalPresentation?: string;
  placentaLocation?: string;
  amnioticFluidIndex?: string;
  fetalMovement?: string;
  organDetails?: string;
}

export interface UltrasoundReport {
  id: string;
  reportNumber: string; // e.g. RAMC-US-2026-089
  patientId: string;
  patientName: string;
  patientHospitalNumber: string;
  patientAge: number;
  examDate: string;
  examType: 'Obstetric Ultrasound (ANC)' | 'Pelvic Ultrasound' | 'Abdominal Ultrasound' | 'Renal & Bladder' | 'Soft Tissue / Doppler';
  referringDoctor: string;
  sonologist: string;
  clinicalIndication: string;
  findings: UltrasoundFinding;
  impression: string;
  recommendations: string;
  status: 'Pending Scan' | 'Preliminary' | 'Verified / Completed';
  feeNle: number;
}

export interface LabTestResult {
  parameter: string;
  value: string;
  referenceRange: string;
  unit: string;
  isAbnormal: boolean;
}

export interface LabInvestigation {
  id: string;
  orderNumber: string; // e.g. RAMC-LAB-2026-0142
  patientId: string;
  patientName: string;
  patientHospitalNumber: string;
  testName: string;
  category: 'Haematology' | 'Parasitology & Rapid Tests' | 'Biochemistry' | 'Urinalysis' | 'Serology';
  orderedDate: string;
  completedDate?: string;
  orderedBy: string;
  status: 'Ordered' | 'Sample Collected' | 'Analyzing' | 'Completed';
  feeNle: number;
  results: LabTestResult[];
  clinicalNotes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Ultrasound' | 'Pharmacy' | 'Emergency' | 'Ward / Bed' | 'Procedure';
  quantity: number;
  unitPriceNle: number;
  totalPriceNle: number;
}

export type PaymentStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Insurance Claim';
export type PaymentMethod = 'Cash' | 'Orange Money' | 'Afrimoney' | 'Bank Transfer' | 'Insurance';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. RAMC-INV-2026-0182
  patientId: string;
  patientName: string;
  patientHospitalNumber: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotalNle: number;
  discountNle: number;
  taxNle: number;
  totalNle: number;
  amountPaidNle: number;
  balanceDueNle: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  notes?: string;
}

export interface WardBed {
  id: string;
  bedNumber: string;
  wardName: 'Emergency & Trauma Bay' | 'Maternal & ANC Ward' | 'General Inpatient Ward' | 'Pediatric Ward';
  status: 'Available' | 'Occupied' | 'Cleaning/Maintenance';
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientHospitalNumber?: string;
  admissionDate?: string;
  attendingDoctor?: string;
  dailyRateNle: number;
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antimalarial' | 'Antibiotic' | 'Analgesic / Anti-inflammatory' | 'Antihypertensive' | 'Prenatal / Vitamin' | 'IV Fluid' | 'Gastrointestinal';
  dosageForm: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | 'IV Infusion' | 'Suspension';
  strength: string;
  stockQuantity: number;
  reorderLevel: number;
  unitPriceNle: number;
  expiryDate: string;
  batchNumber: string;
}
