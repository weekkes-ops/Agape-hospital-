/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Comprehensive Patient EMR & Chart
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  Patient,
  VitalSigns,
  ClinicalEncounter,
  TriageCategory,
  PrescriptionItem,
} from '../../types/hmis';
import {
  X,
  Printer,
  Calendar,
  CreditCard,
  HeartPulse,
  FileText,
  Baby,
  Activity,
  Scan,
  FlaskConical,
  Plus,
  ShieldAlert,
  Clock,
  User,
  Phone,
  MapPin,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

interface Props {
  patient: Patient;
  onClose: () => void;
}

export const PatientDetailModal: React.FC<Props> = ({ patient, onClose }) => {
  const {
    vitals,
    encounters,
    ultrasounds,
    labs,
    invoices,
    addVitalSigns,
    addClinicalEncounter,
    setSelectedInvoiceForPrint,
    setSelectedUltrasoundForView,
    setIsBookAppointmentModalOpen,
    dispensePrescription,
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'vitals' | 'encounters' | 'anc' | 'diagnostics' | 'billing'>('encounters');
  const [isAddingVitals, setIsAddingVitals] = useState(false);
  const [isAddingEncounter, setIsAddingEncounter] = useState(false);

  // Filter records for this specific patient
  const patientVitals = vitals.filter((v) => v.patientId === patient.id);
  const patientEncounters = encounters.filter((e) => e.patientId === patient.id);
  const patientUltrasounds = ultrasounds.filter((u) => u.patientId === patient.id);
  const patientLabs = labs.filter((l) => l.patientId === patient.id);
  const patientInvoices = invoices.filter((i) => i.patientId === patient.id);

  // New Vitals Form State
  const [vBpSys, setVBpSys] = useState(120);
  const [vBpDia, setVBpDia] = useState(80);
  const [vHr, setVHr] = useState(76);
  const [vTemp, setVTemp] = useState(36.8);
  const [vRr, setVRr] = useState(18);
  const [vSpo2, setVSpo2] = useState(98);
  const [vWeight, setVWeight] = useState(65);
  const [vHeight, setVHeight] = useState(165);
  const [vPain, setVPain] = useState(0);
  const [vTriage, setVTriage] = useState<TriageCategory>('Standard (OPD)');
  const [vNote, setVNote] = useState('');

  // New Encounter Form State
  const [encDept, setEncDept] = useState(patient.isMaternalANC ? 'Maternal (ANC) & Child Health' : 'Out Patient Services (OPD)');
  const [encDoctor, setEncDoctor] = useState('Dr. Isata Taylor, MD (CEO & Medical Director)');
  const [encSubjective, setEncSubjective] = useState('');
  const [encObjective, setEncObjective] = useState('');
  const [encAssessment, setEncAssessment] = useState('');
  const [encIcd, setEncIcd] = useState('');
  const [encPlan, setEncPlan] = useState('');
  const [encLabOrders, setEncLabOrders] = useState<string[]>([]);
  const [encUltrasound, setEncUltrasound] = useState(false);
  const [encRxList, setEncRxList] = useState<Omit<PrescriptionItem, 'id' | 'isDispensed'>[]>([]);

  // Temp Prescription inputs
  const [tempMed, setTempMed] = useState('');
  const [tempDose, setTempDose] = useState('');
  const [tempFreq, setTempFreq] = useState('Daily');
  const [tempDuration, setTempDuration] = useState('5 days');
  const [tempPrice, setTempPrice] = useState(50);

  const handleAddPrescriptionItem = () => {
    if (!tempMed) return;
    setEncRxList((prev) => [
      ...prev,
      {
        medication: tempMed,
        dosage: tempDose || '1 dose',
        frequency: tempFreq,
        duration: tempDuration,
        unitPriceNle: Number(tempPrice) || 50,
        quantity: 1,
        instructions: `Take as prescribed (${tempFreq})`,
      },
    ]);
    setTempMed('');
    setTempDose('');
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const heightInM = vHeight / 100;
    const computedBmi = Number((vWeight / (heightInM * heightInM)).toFixed(1));

    addVitalSigns({
      patientId: patient.id,
      bloodPressureSystolic: Number(vBpSys),
      bloodPressureDiastolic: Number(vBpDia),
      heartRate: Number(vHr),
      temperature: Number(vTemp),
      respiratoryRate: Number(vRr),
      spo2: Number(vSpo2),
      weightKg: Number(vWeight),
      heightCm: Number(vHeight),
      bmi: computedBmi,
      painScore: Number(vPain),
      triageCategory: vTriage,
      clinicalNote: vNote || 'Routine clinical vitals captured at triage station.',
      recordedBy: 'Nurse Station Staff',
    });
    setIsAddingVitals(false);
  };

  const handleSaveEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!encAssessment || !encSubjective) return;

    addClinicalEncounter({
      patientId: patient.id,
      department: encDept,
      doctorName: encDoctor,
      subjective: encSubjective,
      objective: encObjective || 'Physical findings reviewed, vitals stable.',
      assessment: encAssessment,
      icdCode: encIcd || undefined,
      plan: encPlan || 'Follow-up as scheduled, complete medications as instructed.',
      prescriptions: encRxList.map((rx, idx) => ({
        ...rx,
        id: `rx-${Date.now()}-${idx}`,
        isDispensed: false,
      })),
      labOrders: encLabOrders,
      ultrasoundOrder: encUltrasound ? 'Diagnostic Ultrasound Ordered' : undefined,
    });

    setIsAddingEncounter(false);
    // Reset form
    setEncSubjective('');
    setEncObjective('');
    setEncAssessment('');
    setEncPlan('');
    setEncRxList([]);
    setEncLabOrders([]);
    setEncUltrasound(false);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-mono text-teal-300 font-bold tracking-wider tabular-nums">
                {patient.hospitalNumber}
              </span>
              <span className="text-slate-500" aria-hidden="true">·</span>
              <span className="text-slate-300">{patient.billingType}</span>
              {patient.isMaternalANC && (
                <>
                  <span className="text-slate-500" aria-hidden="true">·</span>
                  <span className="text-pink-300 font-semibold flex items-center gap-1">
                    <Baby className="w-3.5 h-3.5" />
                    <span>Maternal ANC ({patient.ancDetails?.gestationalWeeks} Weeks)</span>
                  </span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {patient.fullName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              <span>{patient.age} years old ({patient.gender})</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">Blood Group: {patient.bloodGroup} (Hb: {patient.genotype})</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {patient.phone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSummary}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Print Clinical Summary"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Summary</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Allergy Alert Strip if present */}
        {patient.allergies.length > 0 && patient.allergies[0] !== 'None reported' && patient.allergies[0] !== 'None known' && (
          <div className="bg-rose-50 border-b border-rose-200 px-4 sm:px-6 py-2 flex items-center gap-2 text-xs text-rose-800 font-medium">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Documented Patient Allergies: <strong className="font-bold underline">{patient.allergies.join(', ')}</strong></span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="border-b border-slate-200 px-4 sm:px-6 bg-slate-50 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'encounters', label: `Clinical Encounters (${patientEncounters.length})`, icon: FileText },
            { id: 'vitals', label: `Vitals & Triage (${patientVitals.length})`, icon: HeartPulse },
            ...(patient.isMaternalANC ? [{ id: 'anc', label: 'Maternal ANC Card', icon: Baby }] : []),
            { id: 'diagnostics', label: `Diagnostics (${patientUltrasounds.length + patientLabs.length})`, icon: Scan },
            { id: 'billing', label: `Billing & Invoices (${patientInvoices.length})`, icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'border-teal-600 text-teal-800 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: CLINICAL ENCOUNTERS (SOAP NOTES) */}
          {activeTab === 'encounters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Physician Consultation History (SOAP Documentation)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Clinical diagnoses, treatment plans, prescriptions, and ordered investigations.
                  </p>
                </div>
                {!isAddingEncounter && (
                  <button
                    onClick={() => setIsAddingEncounter(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Consultation</span>
                  </button>
                )}
              </div>

              {/* Add Consultation Form */}
              {isAddingEncounter && (
                <form
                  onSubmit={handleSaveEncounter}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">
                      New Clinical Encounter (SOAP Format)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingEncounter(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Clinical Department</label>
                      <select
                        value={encDept}
                        onChange={(e) => setEncDept(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      >
                        <option>Out Patient Services (OPD)</option>
                        <option>Maternal (ANC) & Child Health</option>
                        <option>Internal Medicine</option>
                        <option>Emergency & Trauma Care</option>
                        <option>In-Patient Ward</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Attending Clinician</label>
                      <input
                        type="text"
                        value={encDoctor}
                        onChange={(e) => setEncDoctor(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Subjective */}
                  <div>
                    <label className="block text-xs text-slate-700 font-semibold mb-1">
                      Subjective (S) - Chief Complaint & History of Present Illness
                    </label>
                    <textarea
                      rows={2}
                      value={encSubjective}
                      onChange={(e) => setEncSubjective(e.target.value)}
                      placeholder="e.g. Patient presents with 3-day history of hot body, fever, chills, vomiting..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                      required
                    />
                  </div>

                  {/* Objective */}
                  <div>
                    <label className="block text-xs text-slate-700 font-semibold mb-1">
                      Objective (O) - Physical Examination & Vital Findings
                    </label>
                    <textarea
                      rows={2}
                      value={encObjective}
                      onChange={(e) => setEncObjective(e.target.value)}
                      placeholder="e.g. Chest clear to auscultation, abdomen soft, no organomegaly..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  {/* Assessment */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-700 font-semibold mb-1">
                        Assessment (A) - Working Clinical Diagnosis
                      </label>
                      <input
                        type="text"
                        value={encAssessment}
                        onChange={(e) => setEncAssessment(e.target.value)}
                        placeholder="e.g. Falciparum Malaria / Acute Bronchitis / Stage 1 Hypertension"
                        className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-700 font-semibold mb-1">
                        ICD-11 / Code (Optional)
                      </label>
                      <input
                        type="text"
                        value={encIcd}
                        onChange={(e) => setEncIcd(e.target.value)}
                        placeholder="e.g. B50.9"
                        className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  {/* Plan */}
                  <div>
                    <label className="block text-xs text-slate-700 font-semibold mb-1">
                      Plan (P) - Treatment Strategy & Clinical Counseling
                    </label>
                    <textarea
                      rows={2}
                      value={encPlan}
                      onChange={(e) => setEncPlan(e.target.value)}
                      placeholder="e.g. Start oral artemisinin combination therapy, encourage adequate oral hydration..."
                      className="w-full p-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>

                  {/* Prescribe Medication Section */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">
                      Prescriptions (Automated Billing & Pharmacy Queue Linkage)
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Medication name"
                        value={tempMed}
                        onChange={(e) => setTempMed(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g. 500mg)"
                        value={tempDose}
                        onChange={(e) => setTempDose(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g. TID)"
                        value={tempFreq}
                        onChange={(e) => setTempFreq(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Duration (e.g. 5 days)"
                        value={tempDuration}
                        onChange={(e) => setTempDuration(e.target.value)}
                        className="p-1.5 border border-slate-200 rounded text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={handleAddPrescriptionItem}
                        className="px-2 py-1 bg-slate-900 text-white rounded font-semibold text-xs cursor-pointer hover:bg-slate-800"
                      >
                        + Add Rx
                      </button>
                    </div>

                    {encRxList.length > 0 && (
                      <div className="divide-y divide-slate-100 text-xs pt-2">
                        {encRxList.map((rx, idx) => (
                          <div key={idx} className="py-1 flex items-center justify-between">
                            <span className="font-semibold text-slate-800">{rx.medication} - {rx.dosage} ({rx.frequency})</span>
                            <span className="text-slate-500 font-mono">NLe {rx.unitPriceNle}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Diagnostic Orders toggle */}
                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={encUltrasound}
                        onChange={(e) => setEncUltrasound(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-medium text-slate-800">Order Ultrasound Sonography Scan</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={encLabOrders.includes('Malaria RDT & FBC')}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEncLabOrders((prev) => [...prev, 'Malaria RDT & FBC']);
                          } else {
                            setEncLabOrders((prev) => prev.filter((o) => o !== 'Malaria RDT & FBC'));
                          }
                        }}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="font-medium text-slate-800">Order Lab Tests (Malaria & Blood Count)</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingEncounter(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                    >
                      Save Clinical Note & Generate Automated Bill
                    </button>
                  </div>
                </form>
              )}

              {/* Encounters List */}
              <div className="space-y-4">
                {patientEncounters.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                    No clinical encounters recorded for this patient yet. Click "+ Record Consultation" to document the first encounter.
                  </div>
                ) : (
                  patientEncounters.map((enc) => (
                    <div
                      key={enc.id}
                      className="p-5 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold text-slate-900">{enc.department}</span>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="text-slate-600">{enc.doctorName}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-500 tabular-nums">
                          {new Date(enc.date).toLocaleDateString()} {new Date(enc.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="font-bold text-slate-900">S (Subjective): </span>
                          <span className="text-slate-700">{enc.subjective}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">O (Objective): </span>
                          <span className="text-slate-700">{enc.objective}</span>
                        </div>
                        <div>
                          <span className="font-bold text-teal-800">A (Assessment): </span>
                          <span className="font-bold text-slate-900">{enc.assessment}</span>
                          {enc.icdCode && (
                            <span className="ml-2 font-mono text-slate-500 tabular-nums">
                              [{enc.icdCode}]
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900">P (Plan): </span>
                          <span className="text-slate-700">{enc.plan}</span>
                        </div>
                      </div>

                      {/* Prescriptions under this encounter */}
                      {enc.prescriptions && enc.prescriptions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Prescribed Medications ({enc.prescriptions.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {enc.prescriptions.map((rx) => (
                              <div
                                key={rx.id}
                                className="p-2.5 bg-slate-50 rounded-lg text-xs flex items-center justify-between border border-slate-150"
                              >
                                <div>
                                  <div className="font-bold text-slate-900">{rx.medication}</div>
                                  <div className="text-[11px] text-slate-500">
                                    {rx.dosage} · {rx.frequency} · {rx.duration}
                                  </div>
                                </div>
                                <div className="text-right">
                                  {rx.isDispensed ? (
                                    <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-0.5">
                                      <Check className="w-3 h-3" /> Dispensed
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => dispensePrescription(enc.id, rx.id)}
                                      className="px-2 py-0.5 text-[11px] font-semibold text-teal-800 bg-teal-100 hover:bg-teal-200 rounded cursor-pointer"
                                    >
                                      Dispense
                                    </button>
                                  )}
                                  <div className="font-mono text-slate-500 text-[11px] tabular-nums">
                                    NLe {rx.unitPriceNle}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VITALS & TRIAGE */}
          {activeTab === 'vitals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Clinical Vitals & Triage History
                  </h3>
                  <p className="text-xs text-slate-500">
                    Blood pressure charting, heart rate, temperature, SpO2, and triage severity.
                  </p>
                </div>
                {!isAddingVitals && (
                  <button
                    onClick={() => setIsAddingVitals(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Vitals</span>
                  </button>
                )}
              </div>

              {/* Add Vitals Form */}
              {isAddingVitals && (
                <form
                  onSubmit={handleSaveVitals}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">Record New Clinical Vitals</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingVitals(false)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">BP Systolic (mmHg)</label>
                      <input
                        type="number"
                        value={vBpSys}
                        onChange={(e) => setVBpSys(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">BP Diastolic (mmHg)</label>
                      <input
                        type="number"
                        value={vBpDia}
                        onChange={(e) => setVBpDia(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Pulse / HR (bpm)</label>
                      <input
                        type="number"
                        value={vHr}
                        onChange={(e) => setVHr(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Temp (°C)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vTemp}
                        onChange={(e) => setVTemp(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Respiratory Rate</label>
                      <input
                        type="number"
                        value={vRr}
                        onChange={(e) => setVRr(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">SpO2 (%)</label>
                      <input
                        type="number"
                        value={vSpo2}
                        onChange={(e) => setVSpo2(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={vWeight}
                        onChange={(e) => setVWeight(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1">Height (cm)</label>
                      <input
                        type="number"
                        value={vHeight}
                        onChange={(e) => setVHeight(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-200 rounded font-mono text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-600 mb-1">Triage Priority Level</label>
                      <select
                        value={vTriage}
                        onChange={(e) => setVTriage(e.target.value as TriageCategory)}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-slate-900"
                      >
                        <option>Standard (OPD)</option>
                        <option>Urgent (15-30m)</option>
                        <option>Emergency (Immediate)</option>
                        <option>Non-Urgent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">Triage Nurse Note</label>
                      <input
                        type="text"
                        value={vNote}
                        onChange={(e) => setVNote(e.target.value)}
                        placeholder="Clinical observation or symptom details..."
                        className="w-full p-2 bg-white border border-slate-200 rounded text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingVitals(false)}
                      className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded cursor-pointer"
                    >
                      Save Vitals
                    </button>
                  </div>
                </form>
              )}

              {/* Vitals Log List */}
              <div className="space-y-3">
                {patientVitals.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            v.triageCategory === 'Emergency (Immediate)'
                              ? 'text-rose-700'
                              : v.triageCategory === 'Urgent (15-30m)'
                              ? 'text-amber-700'
                              : 'text-slate-800'
                          }`}
                        >
                          {v.triageCategory}
                        </span>
                        <span className="text-slate-400" aria-hidden="true">·</span>
                        <span className="text-slate-500">{v.recordedBy}</span>
                      </div>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {new Date(v.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-slate-700 font-mono tabular-nums">
                      <div>
                        <div className="text-[11px] text-slate-500">BP</div>
                        <div className="font-bold text-slate-900">{v.bloodPressureSystolic}/{v.bloodPressureDiastolic} mmHg</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Pulse</div>
                        <div className="font-bold text-slate-900">{v.heartRate} bpm</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Temp</div>
                        <div className={`font-bold ${v.temperature >= 38.0 ? 'text-rose-600' : 'text-slate-900'}`}>
                          {v.temperature} °C
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">SpO2</div>
                        <div className="font-bold text-slate-900">{v.spo2} %</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Weight & BMI</div>
                        <div className="font-bold text-slate-900">{v.weightKg} kg (BMI {v.bmi})</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-slate-500">Pain Score</div>
                        <div className="font-bold text-slate-900">{v.painScore} / 10</div>
                      </div>
                    </div>

                    {v.clinicalNote && (
                      <div className="text-slate-600 bg-slate-50 p-2 rounded text-[11px]">
                        <strong>Nurse Note: </strong>{v.clinicalNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MATERNAL ANC CARD */}
          {activeTab === 'anc' && patient.isMaternalANC && (
            <div className="space-y-4">
              <div className="bg-pink-50/60 border border-pink-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-pink-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Baby className="w-5 h-5 text-pink-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Antenatal Care (ANC) Maternal Card & Obstetric Profile
                      </h4>
                      <p className="text-xs text-slate-600">
                        The Royal Agape Medical Centre Specialized Maternal & Child Health Service
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-white border border-pink-200 rounded-lg text-pink-700">
                    Risk Level: {patient.ancDetails?.riskLevel || 'Low'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono tabular-nums">
                  <div className="bg-white p-3 rounded-lg border border-pink-100">
                    <div className="text-[11px] text-slate-500">Gravida / Para</div>
                    <div className="text-base font-bold text-slate-900">
                      G{patient.ancDetails?.gravida} P{patient.ancDetails?.para}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-pink-100">
                    <div className="text-[11px] text-slate-500">Gestational Age</div>
                    <div className="text-base font-bold text-pink-700">
                      {patient.ancDetails?.gestationalWeeks} Weeks
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-pink-100">
                    <div className="text-[11px] text-slate-500">Expected Delivery (EDD)</div>
                    <div className="text-base font-bold text-slate-900">
                      {patient.ancDetails?.edd}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-pink-100">
                    <div className="text-[11px] text-slate-500">Last Ultrasound Scan</div>
                    <div className="text-base font-bold text-slate-900">
                      {patient.ancDetails?.lastScanDate || 'Scheduled'}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-pink-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-900">Recommended ANC Interventions:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Tetanus Toxoid (TT2) Complete</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Iron & Folic Acid Prescribed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Malaria Prophylaxis (IPTp-SP)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DIAGNOSTICS (ULTRASOUND & LAB) */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Ultrasound Scans & Biomedical Laboratory Reports
              </h3>

              {/* Ultrasound Reports */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Ultrasound Sonography Examinations ({patientUltrasounds.length})
                </div>
                {patientUltrasounds.length === 0 ? (
                  <div className="text-xs text-slate-500 p-4 border border-dashed border-slate-200 rounded-lg">
                    No ultrasound scans performed for this patient yet.
                  </div>
                ) : (
                  patientUltrasounds.map((us) => (
                    <div
                      key={us.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Scan className="w-4 h-4 text-teal-600" />
                          <span className="font-bold text-slate-900">{us.examType}</span>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="font-mono text-slate-500 tabular-nums">{us.reportNumber}</span>
                        </div>
                        <button
                          onClick={() => setSelectedUltrasoundForView(us)}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded cursor-pointer"
                        >
                          View Full Sonogram Report
                        </button>
                      </div>

                      <div className="text-slate-700">
                        <strong>Clinical Impression: </strong>{us.impression}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Sonologist: {us.sonologist}</span>
                        <span className="font-mono tabular-nums">Fee: NLe {us.feeNle}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Lab Investigations */}
              <div className="space-y-3 pt-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Laboratory Investigations ({patientLabs.length})
                </div>
                {patientLabs.length === 0 ? (
                  <div className="text-xs text-slate-500 p-4 border border-dashed border-slate-200 rounded-lg">
                    No lab investigations requested for this patient.
                  </div>
                ) : (
                  patientLabs.map((lab) => (
                    <div
                      key={lab.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div>
                          <span className="font-bold text-slate-900">{lab.testName}</span>
                          <span className="ml-2 text-slate-500 font-mono text-[11px]">({lab.orderNumber})</span>
                        </div>
                        <span className={`font-semibold ${lab.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {lab.status}
                        </span>
                      </div>

                      {lab.results && lab.results.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs font-mono tabular-nums">
                            <thead>
                              <tr className="text-[11px] text-slate-400 border-b border-slate-100">
                                <th className="py-1">Parameter</th>
                                <th className="py-1">Result</th>
                                <th className="py-1">Reference Range</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                              {lab.results.map((r, i) => (
                                <tr key={i} className={r.isAbnormal ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                                  <td className="py-1">{r.parameter}</td>
                                  <td className="py-1">{r.value} {r.unit}</td>
                                  <td className="py-1 text-slate-500">{r.referenceRange}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {lab.clinicalNotes && (
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                          <strong>Biomedical Note: </strong>{lab.clinicalNotes}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: BILLING & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Patient Billing, Invoices & Payment Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Automated itemized billing for consultations, ultrasound scans, lab tests, medications, and ward fees.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {patientInvoices.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl">
                    No invoices generated for this patient yet.
                  </div>
                ) : (
                  patientInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 tabular-nums">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-slate-400" aria-hidden="true">·</span>
                          <span className="text-slate-500">{inv.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              inv.paymentStatus === 'Paid'
                                ? 'text-emerald-700'
                                : inv.paymentStatus === 'Partially Paid'
                                ? 'text-amber-700'
                                : 'text-rose-700'
                            }`}
                          >
                            {inv.paymentStatus}
                          </span>
                          <button
                            onClick={() => setSelectedInvoiceForPrint(inv)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          >
                            Receipt
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {inv.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-slate-600">
                            <span>{item.description} (x{item.quantity})</span>
                            <span className="font-mono tabular-nums">NLe {item.totalPriceNle}</span>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-slate-100 pt-2 flex items-center justify-between font-mono tabular-nums font-bold">
                        <span>Total Balance Due:</span>
                        <span className={inv.balanceDueNle > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          NLe {inv.balanceDueNle}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
