/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Appointment Scheduling Manager
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment, AppointmentStatus } from '../../types/hmis';
import {
  Calendar,
  Clock,
  User,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Stethoscope,
  Scan,
  Baby,
  Phone,
} from 'lucide-react';

export const AppointmentManager: React.FC = () => {
  const {
    appointments,
    patients,
    updateAppointmentStatus,
    setIsBookAppointmentModalOpen,
    setSelectedPatientForDetail,
  } = useHospital();

  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus !== 'All' && apt.status !== filterStatus) return false;
    if (filterType !== 'All' && apt.type !== filterType) return false;
    return true;
  });

  // Sort by timeSlot
  const sortedAppointments = [...filteredAppointments].sort((a, b) =>
    a.timeSlot.localeCompare(b.timeSlot)
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Clinical Appointment & Schedule Management
          </h1>
          <p className="text-xs text-slate-500">
            Streamlined physician scheduling, antenatal booking, ultrasound scan queues, and consultation statuses.
          </p>
        </div>

        <button
          onClick={() => setIsBookAppointmentModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Filter Specialty:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Specialties</option>
              <option value="ANC Checkup">Maternal ANC</option>
              <option value="Ultrasound Scan">Ultrasound Scan</option>
              <option value="General OPD">General OPD</option>
              <option value="Internal Medicine">Internal Medicine</option>
              <option value="Pediatric">Pediatric</option>
              <option value="Emergency / Trauma">Emergency / Trauma</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Checked In">Checked In (Waiting)</option>
              <option value="In Consultation">In Consultation</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-mono tabular-nums">
          Showing {sortedAppointments.length} appointments
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAppointments.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center text-slate-500 border border-slate-200 rounded-xl">
            No clinic appointments match the selected filters.
          </div>
        ) : (
          sortedAppointments.map((apt) => {
            const patient = patients.find((p) => p.id === apt.patientId);
            return (
              <div
                key={apt.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs hover:border-teal-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 font-medium tabular-nums flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.timeSlot}</span>
                    </span>
                    <span
                      className={`font-bold ${
                        apt.status === 'Completed'
                          ? 'text-emerald-700'
                          : apt.status === 'In Consultation'
                          ? 'text-indigo-700'
                          : apt.status === 'Checked In'
                          ? 'text-amber-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div>
                    <button
                      onClick={() => patient && setSelectedPatientForDetail(patient)}
                      className="font-bold text-slate-900 text-sm hover:text-teal-700 text-left transition-colors cursor-pointer"
                    >
                      {apt.patientName}
                    </button>
                    <div className="text-slate-500 text-[11px] font-mono tabular-nums">
                      {apt.patientHospitalNumber} · {apt.patientPhone}
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-150">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      {apt.type === 'ANC Checkup' ? (
                        <Baby className="w-3.5 h-3.5 text-pink-600" />
                      ) : apt.type === 'Ultrasound Scan' ? (
                        <Scan className="w-3.5 h-3.5 text-teal-600" />
                      ) : (
                        <Stethoscope className="w-3.5 h-3.5 text-slate-500" />
                      )}
                      <span>{apt.type}</span>
                    </div>
                    <div className="text-slate-600">{apt.reason}</div>
                    <div className="text-slate-500 text-[11px] pt-1">
                      Doctor: {apt.doctorName}
                    </div>
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => patient && setSelectedPatientForDetail(patient)}
                    className="text-teal-700 hover:underline font-semibold cursor-pointer"
                  >
                    View EMR Chart
                  </button>

                  <div className="flex items-center gap-1.5">
                    {apt.status === 'Scheduled' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                        className="px-2.5 py-1 font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded cursor-pointer"
                      >
                        Check In
                      </button>
                    )}
                    {apt.status === 'Checked In' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'In Consultation')}
                        className="px-2.5 py-1 font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded cursor-pointer"
                      >
                        Call In
                      </button>
                    )}
                    {apt.status === 'In Consultation' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                        className="px-2.5 py-1 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded cursor-pointer"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
