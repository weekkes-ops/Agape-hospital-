/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Hospital Context & State Engine
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  VitalSigns,
  ClinicalEncounter,
  Appointment,
  UltrasoundReport,
  LabInvestigation,
  Invoice,
  WardBed,
  PharmacyItem,
  AppointmentStatus,
  PaymentMethod,
  TriageCategory,
} from '../types/hmis';
import {
  INITIAL_PATIENTS,
  INITIAL_VITALS,
  INITIAL_ENCOUNTERS,
  INITIAL_APPOINTMENTS,
  INITIAL_ULTRASOUND_REPORTS,
  INITIAL_LABS,
  INITIAL_INVOICES,
  INITIAL_BEDS,
  INITIAL_PHARMACY,
} from '../data/mockData';

export type NavigationTab =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'billing'
  | 'diagnostics'
  | 'pharmacy'
  | 'wards';

interface HospitalContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Data
  patients: Patient[];
  vitals: VitalSigns[];
  encounters: ClinicalEncounter[];
  appointments: Appointment[];
  ultrasounds: UltrasoundReport[];
  labs: LabInvestigation[];
  invoices: Invoice[];
  beds: WardBed[];
  pharmacy: PharmacyItem[];

  // Modal / Sheet States
  isFlyerModalOpen: boolean;
  setIsFlyerModalOpen: (open: boolean) => void;
  isNewPatientModalOpen: boolean;
  setIsNewPatientModalOpen: (open: boolean) => void;
  isBookAppointmentModalOpen: boolean;
  setIsBookAppointmentModalOpen: (open: boolean) => void;
  isNewInvoiceModalOpen: boolean;
  setIsNewInvoiceModalOpen: (open: boolean) => void;
  selectedPatientForDetail: Patient | null;
  setSelectedPatientForDetail: (patient: Patient | null) => void;
  selectedInvoiceForPrint: Invoice | null;
  setSelectedInvoiceForPrint: (invoice: Invoice | null) => void;
  selectedUltrasoundForView: UltrasoundReport | null;
  setSelectedUltrasoundForView: (us: UltrasoundReport | null) => void;

  // Actions
  addPatient: (data: Partial<Patient> & { fullName: string; phone: string; gender: Patient['gender']; age: number }) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  addVitalSigns: (data: Omit<VitalSigns, 'id' | 'timestamp'>) => VitalSigns;
  addClinicalEncounter: (data: Omit<ClinicalEncounter, 'id' | 'date'>) => ClinicalEncounter;
  addAppointment: (data: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addUltrasoundReport: (data: Omit<UltrasoundReport, 'id' | 'reportNumber'>) => UltrasoundReport;
  updateUltrasoundStatus: (id: string, status: UltrasoundReport['status']) => void;
  addLabInvestigation: (data: Omit<LabInvestigation, 'id' | 'orderNumber'>) => LabInvestigation;
  updateLabStatus: (id: string, status: LabInvestigation['status'], results?: LabInvestigation['results']) => void;
  createInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotalNle' | 'totalNle' | 'balanceDueNle'>) => Invoice;
  recordInvoicePayment: (invoiceId: string, amount: number, method: PaymentMethod, reference: string) => void;
  dispensePrescription: (encounterId: string, prescriptionId: string) => void;
  updateBedStatus: (bedId: string, status: WardBed['status'], patientId?: string) => void;
  resetAllData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'royal_agape_hmis_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Could not load ${key} from localStorage, using seed data`, e);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage`, e);
  }
}

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Persistent clinical datasets
  const [patients, setPatients] = useState<Patient[]>(() => loadFromStorage('patients', INITIAL_PATIENTS));
  const [vitals, setVitals] = useState<VitalSigns[]>(() => loadFromStorage('vitals', INITIAL_VITALS));
  const [encounters, setEncounters] = useState<ClinicalEncounter[]>(() => loadFromStorage('encounters', INITIAL_ENCOUNTERS));
  const [appointments, setAppointments] = useState<Appointment[]>(() => loadFromStorage('appointments', INITIAL_APPOINTMENTS));
  const [ultrasounds, setUltrasounds] = useState<UltrasoundReport[]>(() => loadFromStorage('ultrasounds', INITIAL_ULTRASOUND_REPORTS));
  const [labs, setLabs] = useState<LabInvestigation[]>(() => loadFromStorage('labs', INITIAL_LABS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadFromStorage('invoices', INITIAL_INVOICES));
  const [beds, setBeds] = useState<WardBed[]>(() => loadFromStorage('beds', INITIAL_BEDS));
  const [pharmacy, setPharmacy] = useState<PharmacyItem[]>(() => loadFromStorage('pharmacy', INITIAL_PHARMACY));

  // Modal states
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isBookAppointmentModalOpen, setIsBookAppointmentModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState<Patient | null>(null);
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<Invoice | null>(null);
  const [selectedUltrasoundForView, setSelectedUltrasoundForView] = useState<UltrasoundReport | null>(null);

  // Sync with LocalStorage
  useEffect(() => { saveToStorage('patients', patients); }, [patients]);
  useEffect(() => { saveToStorage('vitals', vitals); }, [vitals]);
  useEffect(() => { saveToStorage('encounters', encounters); }, [encounters]);
  useEffect(() => { saveToStorage('appointments', appointments); }, [appointments]);
  useEffect(() => { saveToStorage('ultrasounds', ultrasounds); }, [ultrasounds]);
  useEffect(() => { saveToStorage('labs', labs); }, [labs]);
  useEffect(() => { saveToStorage('invoices', invoices); }, [invoices]);
  useEffect(() => { saveToStorage('beds', beds); }, [beds]);
  useEffect(() => { saveToStorage('pharmacy', pharmacy); }, [pharmacy]);

  // Actions
  const addPatient = (data: Partial<Patient> & { fullName: string; phone: string; gender: Patient['gender']; age: number }): Patient => {
    const nextSeq = patients.length + 47;
    const yearCode = new Date().getFullYear().toString().slice(-2);
    const newHospitalNumber = `RAMC-${yearCode}-${String(nextSeq).padStart(4, '0')}`;
    const today = new Date().toISOString().split('T')[0];

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      hospitalNumber: newHospitalNumber,
      fullName: data.fullName,
      dateOfBirth: data.dateOfBirth || `${new Date().getFullYear() - data.age}-01-01`,
      age: data.age,
      gender: data.gender,
      phone: data.phone,
      address: data.address || 'Freetown, Sierra Leone',
      bloodGroup: data.bloodGroup || 'O+',
      genotype: data.genotype || 'AA',
      allergies: data.allergies || ['None reported'],
      chronicConditions: data.chronicConditions || ['None'],
      emergencyContact: data.emergencyContact || {
        name: 'Family Member',
        relation: 'Relative',
        phone: data.phone,
      },
      billingType: data.billingType || 'Self-Pay (Cash/Mobile Money)',
      status: data.status || 'Outpatient',
      isMaternalANC: Boolean(data.isMaternalANC),
      ancDetails: data.isMaternalANC ? data.ancDetails : undefined,
      registeredAt: today,
      lastVisitDate: today,
    };

    setPatients((prev) => [newPatient, ...prev]);
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedPatientForDetail?.id === id) {
      setSelectedPatientForDetail((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const addVitalSigns = (data: Omit<VitalSigns, 'id' | 'timestamp'>): VitalSigns => {
    const newVital: VitalSigns = {
      ...data,
      id: `vit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setVitals((prev) => [newVital, ...prev]);

    // Update patient's last visit date
    setPatients((prev) =>
      prev.map((p) =>
        p.id === data.patientId ? { ...p, lastVisitDate: new Date().toISOString().split('T')[0] } : p
      )
    );

    return newVital;
  };

  const addClinicalEncounter = (data: Omit<ClinicalEncounter, 'id' | 'date'>): ClinicalEncounter => {
    const newEncounter: ClinicalEncounter = {
      ...data,
      id: `enc-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setEncounters((prev) => [newEncounter, ...prev]);

    // Automated Billing Workflow: Link consultation fee + prescribed items to an invoice
    const patient = patients.find((p) => p.id === data.patientId);
    if (patient) {
      const items: Invoice['items'] = [
        {
          id: `item-c-${Date.now()}`,
          description: `${data.department} Consultation (${data.doctorName})`,
          category: 'Consultation',
          quantity: 1,
          unitPriceNle: 180,
          totalPriceNle: 180,
        },
      ];

      // Add medications to invoice items
      data.prescriptions.forEach((rx, idx) => {
        items.push({
          id: `item-rx-${Date.now()}-${idx}`,
          description: `${rx.medication} (${rx.dosage})`,
          category: 'Pharmacy',
          quantity: rx.quantity || 1,
          unitPriceNle: rx.unitPriceNle || 50,
          totalPriceNle: (rx.quantity || 1) * (rx.unitPriceNle || 50),
        });
      });

      // Add ultrasound if requested
      if (data.ultrasoundOrder) {
        items.push({
          id: `item-us-${Date.now()}`,
          description: 'Ultrasound Sonography Scan',
          category: 'Ultrasound',
          quantity: 1,
          unitPriceNle: 280,
          totalPriceNle: 280,
        });
      }

      // Add lab orders if requested
      data.labOrders.forEach((lab, idx) => {
        items.push({
          id: `item-lb-${Date.now()}-${idx}`,
          description: `Laboratory Test: ${lab}`,
          category: 'Laboratory',
          quantity: 1,
          unitPriceNle: 95,
          totalPriceNle: 95,
        });
      });

      const subtotal = items.reduce((sum, item) => sum + item.totalPriceNle, 0);
      const invoiceNumber = `RAMC-INV-2026-${String(invoices.length + 186).padStart(4, '0')}`;
      const today = new Date().toISOString().split('T')[0];

      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber,
        patientId: patient.id,
        patientName: patient.fullName,
        patientHospitalNumber: patient.hospitalNumber,
        patientPhone: patient.phone,
        date: today,
        dueDate: today,
        items,
        subtotalNle: subtotal,
        discountNle: 0,
        taxNle: 0,
        totalNle: subtotal,
        amountPaidNle: 0,
        balanceDueNle: subtotal,
        paymentStatus: patient.billingType.includes('Insurance') ? 'Insurance Claim' : 'Pending',
        notes: `Generated from clinical encounter on ${today} by ${data.doctorName}`,
      };

      setInvoices((prev) => [newInvoice, ...prev]);
    }

    return newEncounter;
  };

  const addAppointment = (data: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...data,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setAppointments((prev) => [newApt, ...prev]);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
  };

  const addUltrasoundReport = (data: Omit<UltrasoundReport, 'id' | 'reportNumber'>): UltrasoundReport => {
    const reportNumber = `RAMC-US-2026-${String(ultrasounds.length + 91).padStart(3, '0')}`;
    const newReport: UltrasoundReport = {
      ...data,
      id: `us-${Date.now()}`,
      reportNumber,
    };
    setUltrasounds((prev) => [newReport, ...prev]);

    // Append to patient invoice automatically if not already billed
    const patient = patients.find((p) => p.id === data.patientId);
    if (patient) {
      const today = new Date().toISOString().split('T')[0];
      const newInvoice: Invoice = {
        id: `inv-us-${Date.now()}`,
        invoiceNumber: `RAMC-INV-2026-${String(invoices.length + 187).padStart(4, '0')}`,
        patientId: patient.id,
        patientName: patient.fullName,
        patientHospitalNumber: patient.hospitalNumber,
        patientPhone: patient.phone,
        date: today,
        dueDate: today,
        items: [
          {
            id: `item-us-${Date.now()}`,
            description: `${data.examType} - ${reportNumber}`,
            category: 'Ultrasound',
            quantity: 1,
            unitPriceNle: data.feeNle,
            totalPriceNle: data.feeNle,
          },
        ],
        subtotalNle: data.feeNle,
        discountNle: 0,
        taxNle: 0,
        totalNle: data.feeNle,
        amountPaidNle: 0,
        balanceDueNle: data.feeNle,
        paymentStatus: 'Pending',
        notes: `Ultrasound investigation performed by ${data.sonologist}`,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }

    return newReport;
  };

  const updateUltrasoundStatus = (id: string, status: UltrasoundReport['status']) => {
    setUltrasounds((prev) =>
      prev.map((us) => (us.id === id ? { ...us, status } : us))
    );
  };

  const addLabInvestigation = (data: Omit<LabInvestigation, 'id' | 'orderNumber'>): LabInvestigation => {
    const orderNumber = `RAMC-LAB-2026-${String(labs.length + 145).padStart(4, '0')}`;
    const newLab: LabInvestigation = {
      ...data,
      id: `lab-${Date.now()}`,
      orderNumber,
    };
    setLabs((prev) => [newLab, ...prev]);

    // Append to billing
    const patient = patients.find((p) => p.id === data.patientId);
    if (patient) {
      const today = new Date().toISOString().split('T')[0];
      const newInvoice: Invoice = {
        id: `inv-lab-${Date.now()}`,
        invoiceNumber: `RAMC-INV-2026-${String(invoices.length + 188).padStart(4, '0')}`,
        patientId: patient.id,
        patientName: patient.fullName,
        patientHospitalNumber: patient.hospitalNumber,
        patientPhone: patient.phone,
        date: today,
        dueDate: today,
        items: [
          {
            id: `item-lab-${Date.now()}`,
            description: `${data.testName} (${data.category}) - ${orderNumber}`,
            category: 'Laboratory',
            quantity: 1,
            unitPriceNle: data.feeNle,
            totalPriceNle: data.feeNle,
          },
        ],
        subtotalNle: data.feeNle,
        discountNle: 0,
        taxNle: 0,
        totalNle: data.feeNle,
        amountPaidNle: 0,
        balanceDueNle: data.feeNle,
        paymentStatus: 'Pending',
        notes: `Clinical laboratory order by ${data.orderedBy}`,
      };
      setInvoices((prev) => [newInvoice, ...prev]);
    }

    return newLab;
  };

  const updateLabStatus = (id: string, status: LabInvestigation['status'], results?: LabInvestigation['results']) => {
    setLabs((prev) =>
      prev.map((lab) => {
        if (lab.id === id) {
          return {
            ...lab,
            status,
            results: results || lab.results,
            completedDate: status === 'Completed' ? new Date().toISOString() : lab.completedDate,
          };
        }
        return lab;
      })
    );
  };

  const createInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'subtotalNle' | 'totalNle' | 'balanceDueNle'>): Invoice => {
    const subtotal = data.items.reduce((sum, item) => sum + item.totalPriceNle, 0);
    const total = Math.max(0, subtotal - (data.discountNle || 0) + (data.taxNle || 0));
    const balance = Math.max(0, total - (data.amountPaidNle || 0));
    const invoiceNumber = `RAMC-INV-2026-${String(invoices.length + 189).padStart(4, '0')}`;

    const newInvoice: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      invoiceNumber,
      subtotalNle: subtotal,
      totalNle: total,
      balanceDueNle: balance,
    };
    setInvoices((prev) => [newInvoice, ...prev]);
    return newInvoice;
  };

  const recordInvoicePayment = (invoiceId: string, amount: number, method: PaymentMethod, reference: string) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === invoiceId) {
          const newAmountPaid = (inv.amountPaidNle || 0) + amount;
          const newBalance = Math.max(0, inv.totalNle - newAmountPaid);
          const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            amountPaidNle: newAmountPaid,
            balanceDueNle: newBalance,
            paymentStatus: newStatus,
            paymentMethod: method,
            paymentReference: reference,
            notes: (inv.notes ? inv.notes + ' | ' : '') + `Payment of NLe ${amount} recorded via ${method} (${reference})`,
          };
        }
        return inv;
      })
    );
  };

  const dispensePrescription = (encounterId: string, prescriptionId: string) => {
    setEncounters((prev) =>
      prev.map((enc) => {
        if (enc.id === encounterId) {
          return {
            ...enc,
            prescriptions: enc.prescriptions.map((rx) => {
              if (rx.id === prescriptionId) {
                // Deduct stock from pharmacy
                setPharmacy((pList) =>
                  pList.map((pItem) => {
                    if (rx.medication.toLowerCase().includes(pItem.name.toLowerCase().split(' ')[0])) {
                      return {
                        ...pItem,
                        stockQuantity: Math.max(0, pItem.stockQuantity - (rx.quantity || 1)),
                      };
                    }
                    return pItem;
                  })
                );
                return { ...rx, isDispensed: true };
              }
              return rx;
            }),
          };
        }
        return enc;
      })
    );
  };

  const updateBedStatus = (bedId: string, status: WardBed['status'], patientId?: string) => {
    const patient = patientId ? patients.find((p) => p.id === patientId) : undefined;
    setBeds((prev) =>
      prev.map((bed) => {
        if (bed.id === bedId) {
          return {
            ...bed,
            status,
            currentPatientId: status === 'Occupied' ? patientId : undefined,
            currentPatientName: status === 'Occupied' ? patient?.fullName : undefined,
            currentPatientHospitalNumber: status === 'Occupied' ? patient?.hospitalNumber : undefined,
            admissionDate: status === 'Occupied' ? new Date().toISOString() : undefined,
          };
        }
        return bed;
      })
    );
  };

  const resetAllData = () => {
    setPatients(INITIAL_PATIENTS);
    setVitals(INITIAL_VITALS);
    setEncounters(INITIAL_ENCOUNTERS);
    setAppointments(INITIAL_APPOINTMENTS);
    setUltrasounds(INITIAL_ULTRASOUND_REPORTS);
    setLabs(INITIAL_LABS);
    setInvoices(INITIAL_INVOICES);
    setBeds(INITIAL_BEDS);
    setPharmacy(INITIAL_PHARMACY);
    localStorage.clear();
  };

  return (
    <HospitalContext.Provider
      value={{
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        patients,
        vitals,
        encounters,
        appointments,
        ultrasounds,
        labs,
        invoices,
        beds,
        pharmacy,
        isFlyerModalOpen,
        setIsFlyerModalOpen,
        isNewPatientModalOpen,
        setIsNewPatientModalOpen,
        isBookAppointmentModalOpen,
        setIsBookAppointmentModalOpen,
        isNewInvoiceModalOpen,
        setIsNewInvoiceModalOpen,
        selectedPatientForDetail,
        setSelectedPatientForDetail,
        selectedInvoiceForPrint,
        setSelectedInvoiceForPrint,
        selectedUltrasoundForView,
        setSelectedUltrasoundForView,
        addPatient,
        updatePatient,
        addVitalSigns,
        addClinicalEncounter,
        addAppointment,
        updateAppointmentStatus,
        addUltrasoundReport,
        updateUltrasoundStatus,
        addLabInvestigation,
        updateLabStatus,
        createInvoice,
        recordInvoicePayment,
        dispensePrescription,
        updateBedStatus,
        resetAllData,
      }}
    >
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
