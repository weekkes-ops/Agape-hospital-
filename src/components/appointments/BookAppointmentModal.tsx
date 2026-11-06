/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Appointment Booking Modal
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Appointment } from '../../types/hmis';
import { X, Calendar, Clock, User, Stethoscope } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const BookAppointmentModal: React.FC<Props> = ({ onClose }) => {
  const { patients, addAppointment } = useHospital();

  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [department, setDepartment] = useState('Out Patient Services (OPD)');
  const [doctorName, setDoctorName] = useState('Dr. Isata Taylor, MD (CEO & Medical Director)');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('09:30 - 10:00');
  const [type, setType] = useState<Appointment['type']>('General OPD');
  const [reason, setReason] = useState('');

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  const timeSlots = [
    '08:30 - 09:00',
    '09:00 - 09:30',
    '09:30 - 10:00',
    '10:00 - 10:30',
    '10:30 - 11:00',
    '11:00 - 11:30',
    '11:30 - 12:00',
    '13:00 - 13:30',
    '13:30 - 14:00',
    '14:00 - 14:30',
    '14:30 - 15:00',
    '15:00 - 15:30',
    '15:30 - 16:00',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || !reason.trim()) return;

    addAppointment({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientHospitalNumber: selectedPatient.hospitalNumber,
      patientPhone: selectedPatient.phone,
      department,
      doctorName,
      date,
      timeSlot,
      reason: reason.trim(),
      type,
      status: 'Scheduled',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="p-4 sm:p-5 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="text-base font-bold">Schedule Clinic Appointment</h2>
              <p className="text-xs text-teal-200">The Royal Agape Medical Centre · Outpatient & Diagnostic Booking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Patient Selector */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Select Patient *</label>
            <select
              value={selectedPatientId}
              onChange={(e) => {
                setSelectedPatientId(e.target.value);
                const pat = patients.find((p) => p.id === e.target.value);
                if (pat?.isMaternalANC) {
                  setDepartment('Maternal (ANC) & Child Health');
                  setType('ANC Checkup');
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.hospitalNumber}) · {p.phone}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Clinical Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option>Out Patient Services (OPD)</option>
                <option>Maternal (ANC) & Child Health</option>
                <option>Ultrasound Scan Service</option>
                <option>Internal Medicine</option>
                <option>24/7 Emergency & Trauma Care</option>
                <option>Laboratory Services</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Appointment Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="General OPD">General OPD</option>
                <option value="ANC Checkup">ANC Antenatal Checkup</option>
                <option value="Ultrasound Scan">Ultrasound Scan</option>
                <option value="Internal Medicine">Internal Medicine Review</option>
                <option value="Pediatric">Pediatric Consultation</option>
                <option value="Lab Testing">Lab Diagnostic Investigation</option>
                <option value="Emergency / Trauma">Emergency / Trauma Triage</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Attending Physician / Specialist</label>
            <select
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium"
            >
              <option>Dr. Isata Taylor, MD (CEO & Medical Director)</option>
              <option>Dr. Patrick Conteh, FWACP (Consultant Internal Medicine)</option>
              <option>Dr. Mariama Jalloh, DMRD (Senior Sonologist / Ultrasound Specialist)</option>
              <option>Nurse Matron Zainab Sesay, RM (Lead Midwife & ANC Lead)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Time Slot *</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono tabular-nums"
              >
                {timeSlots.map((ts) => (
                  <option key={ts} value={ts}>{ts}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Reason for Visit / Symptoms *</label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Routine 28-week antenatal ultrasound & blood test checkup..."
              required
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white bg-teal-600 hover:bg-teal-700 rounded-lg font-semibold shadow-xs cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
