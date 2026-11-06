/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Executive & Clinical Dashboard
 */

import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import { ClinicalTrendsChart } from './ClinicalTrendsChart';
import {
  Users,
  Baby,
  AlertCircle,
  FileSpreadsheet,
  Banknote,
  BedDouble,
  Clock,
  ArrowRight,
  Plus,
  Stethoscope,
  Scan,
  CheckCircle2,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

export const DashboardOverview: React.FC = () => {
  const {
    patients,
    vitals,
    appointments,
    ultrasounds,
    labs,
    invoices,
    beds,
    setActiveTab,
    setIsNewPatientModalOpen,
    setIsBookAppointmentModalOpen,
    setIsNewInvoiceModalOpen,
    setSelectedPatientForDetail,
    updateAppointmentStatus,
  } = useHospital();

  // Metrics computation
  const todayDateStr = new Date().toISOString().split('T')[0];

  const totalPatientsCount = patients.length;
  const ancMaternalCount = patients.filter((p) => p.isMaternalANC).length;
  const emergencyCount = patients.filter((p) => p.status === 'Emergency').length;
  const pendingDiagnosticsCount =
    ultrasounds.filter((u) => u.status !== 'Verified / Completed').length +
    labs.filter((l) => l.status !== 'Completed').length;

  const todayInvoices = invoices.filter((i) => i.date === todayDateStr);
  const totalBilledToday = todayInvoices.reduce((sum, inv) => sum + inv.totalNle, 0);
  const totalCollectedToday = todayInvoices.reduce((sum, inv) => sum + inv.amountPaidNle, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDueNle, 0);

  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const totalBeds = beds.length;
  const bedOccupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  // Today's appointments
  const todayAppointments = appointments.filter((apt) => apt.date === todayDateStr);

  // Patients needing triage or active in emergency
  const urgentVitals = vitals.filter(
    (v) => v.triageCategory === 'Emergency (Immediate)' || v.triageCategory === 'Urgent (15-30m)'
  );

  return (
    <div className="space-y-6">
      {/* Clinic Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{HOSPITAL_METADATA.address}</span>
              <span aria-hidden="true">·</span>
              <span className="text-teal-700 font-semibold">24/7 Trauma Ready</span>
              <span aria-hidden="true">·</span>
              <span>Reg: {HOSPITAL_METADATA.registrationNumber}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Clinical & Administrative Operations
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Real-time patient triage, specialized maternal ANC care, diagnostic ultrasound sonography, and automated billing reconciliation for The Royal Agape Medical Centre.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsBookAppointmentModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => setIsNewInvoiceModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Banknote className="w-3.5 h-3.5 text-slate-500" />
              <span>Create Bill</span>
            </button>
            <button
              onClick={() => setIsNewPatientModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Patient Intake</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Total Registered</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalPatientsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active Medical Files</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Maternal (ANC)</span>
            <Baby className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {ancMaternalCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Antenatal Mothers</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Emergency Triage</span>
            <AlertCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600 font-mono tabular-nums">
            {emergencyCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Immediate / Trauma Cases</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Diagnostic Queue</span>
            <Scan className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {pendingDiagnosticsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Ultrasound & Lab Orders</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Today's Revenue</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums truncate">
            NLe {totalCollectedToday.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
            Billed: NLe {totalBilledToday.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Ward Occupancy</span>
            <BedDouble className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {bedOccupancyRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono tabular-nums">
            {occupiedBeds} of {totalBeds} Beds Active
          </div>
        </div>
      </div>

      {/* Recharts Patient Intake & Revenue Trends Summary Card */}
      <ClinicalTrendsChart />

      {/* Main Grid: Clinical Triage & Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 spans): Active Triage & Diagnostic Quick Board */}
        <div className="lg:col-span-2 space-y-6">
          {/* Triage & High-Priority Patient Monitor */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Priority Clinical Triage & Emergency Monitor
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('patients')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>All Patients</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {urgentVitals.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No urgent or emergency triage alerts currently flagged.
                </div>
              ) : (
                urgentVitals.map((v) => {
                  const patient = patients.find((p) => p.id === v.patientId);
                  const isRed = v.triageCategory === 'Emergency (Immediate)';
                  return (
                    <div
                      key={v.id}
                      className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              isRed ? 'text-rose-700' : 'text-amber-700'
                            }`}
                          >
                            {v.triageCategory}
                          </span>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <button
                            onClick={() => patient && setSelectedPatientForDetail(patient)}
                            className="font-bold text-slate-900 hover:text-teal-700 text-sm cursor-pointer"
                          >
                            {patient?.fullName}
                          </button>
                          <span className="text-xs font-mono text-slate-500 tabular-nums">
                            ({patient?.hospitalNumber})
                          </span>
                          {patient?.isMaternalANC && (
                            <span className="text-[11px] font-semibold text-pink-700">
                              ANC Mother
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600">
                          {v.clinicalNote}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono tabular-nums">
                          <span>BP: {v.bloodPressureSystolic}/{v.bloodPressureDiastolic} mmHg</span>
                          <span>HR: {v.heartRate} bpm</span>
                          <span>Temp: {v.temperature}°C</span>
                          <span>SpO2: {v.spo2}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => patient && setSelectedPatientForDetail(patient)}
                          className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                        >
                          Open EMR
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Diagnostic Ultrasound & Lab Quick Board */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Diagnostic Ultrasound & Laboratory Queue
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>Open Diagnostic Center</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Ultrasound Sub-List */}
              <div className="p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Ultrasound Scans ({ultrasounds.length})</span>
                  <span className="text-teal-700 font-medium normal-case">Digital Sonography</span>
                </div>
                <div className="space-y-2">
                  {ultrasounds.slice(0, 3).map((us) => (
                    <div
                      key={us.id}
                      className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{us.patientName}</span>
                        <span className="font-mono text-slate-500 tabular-nums">
                          NLe {us.feeNle}
                        </span>
                      </div>
                      <div className="text-slate-600 font-medium">{us.examType}</div>
                      <div className="text-slate-500 text-[11px] truncate">
                        Sonologist: {us.sonologist}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Sub-List */}
              <div className="p-4 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                  <span>Laboratory Orders ({labs.length})</span>
                  <span className="text-teal-700 font-medium normal-case">Biomedical Lab</span>
                </div>
                <div className="space-y-2">
                  {labs.slice(0, 3).map((lab) => (
                    <div
                      key={lab.id}
                      className="p-3 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-150"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{lab.patientName}</span>
                        <span className={`font-semibold ${lab.status === 'Completed' ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {lab.status}
                        </span>
                      </div>
                      <div className="text-slate-600 font-medium truncate">{lab.testName}</div>
                      <div className="text-slate-500 text-[11px]">
                        Ref: {lab.orderNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Today's Appointments & Clinical Duty Schedule */}
        <div className="space-y-6">
          {/* Today's Appointments */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Today's Clinic Consultations
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('appointments')}
                className="text-xs text-teal-700 hover:text-teal-800 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-[380px] overflow-y-auto">
              {todayAppointments.length === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">
                  No appointments scheduled for today.
                </div>
              ) : (
                todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 text-xs space-y-1.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-medium text-slate-500 tabular-nums">
                        {apt.timeSlot}
                      </span>
                      <span
                        className={`font-semibold ${
                          apt.status === 'Completed'
                            ? 'text-emerald-700'
                            : apt.status === 'In Consultation'
                            ? 'text-indigo-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 text-sm">
                      {apt.patientName}
                    </div>

                    <div className="text-slate-600">
                      {apt.reason}
                    </div>

                    <div className="text-slate-500 text-[11px] flex items-center justify-between pt-1">
                      <span>{apt.doctorName}</span>
                      <div className="flex items-center gap-1.5">
                        {apt.status === 'Checked In' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded cursor-pointer"
                          >
                            Call In
                          </button>
                        )}
                        {apt.status === 'In Consultation' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                          >
                            Mark Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Billing & Revenue Snapshot */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Automated Revenue Ledger
              </span>
              <button
                onClick={() => setActiveTab('billing')}
                className="text-xs text-teal-700 font-semibold hover:underline cursor-pointer"
              >
                Invoices
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Receivables Outstanding:</span>
                <span className="font-mono font-bold text-rose-600 tabular-nums">
                  NLe {totalOutstanding.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Supported Payment Rails:</span>
                <span className="font-medium text-slate-900">Cash, Orange Money, Afrimoney</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Inpatient Ward Rates:</span>
                <span className="font-mono tabular-nums">NLe 220 - 280 / day</span>
              </div>
            </div>

            <button
              onClick={() => setIsNewInvoiceModalOpen(true)}
              className="w-full mt-2 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200 text-center cursor-pointer"
            >
              Generate Patient Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
