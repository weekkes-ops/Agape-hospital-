/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Inpatient Wards & Emergency Beds
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { WardBed } from '../../types/hmis';
import { BedDouble, AlertCircle, CheckCircle2, User, Clock, Plus, X } from 'lucide-react';

export const WardBedManager: React.FC = () => {
  const { beds, patients, updateBedStatus, setSelectedPatientForDetail } = useHospital();

  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [admittingBed, setAdmittingBed] = useState<WardBed | null>(null);
  const [admitPatientId, setAdmitPatientId] = useState<string>(patients[0]?.id || '');

  const filteredBeds = beds.filter((b) => {
    if (selectedWard !== 'All' && b.wardName !== selectedWard) return false;
    return true;
  });

  const occupiedCount = beds.filter((b) => b.status === 'Occupied').length;
  const availableCount = beds.filter((b) => b.status === 'Available').length;
  const cleaningCount = beds.filter((b) => b.status === 'Cleaning/Maintenance').length;

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admittingBed || !admitPatientId) return;

    updateBedStatus(admittingBed.id, 'Occupied', admitPatientId);
    setAdmittingBed(null);
  };

  const handleDischarge = (bedId: string) => {
    updateBedStatus(bedId, 'Cleaning/Maintenance');
  };

  const handleMarkAvailable = (bedId: string) => {
    updateBedStatus(bedId, 'Available');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Inpatient Wards & 24/7 Emergency Bed Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time census, maternal ward allocation, trauma observation bays, and daily bed billing.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg">
            Available: <strong>{availableCount}</strong>
          </div>
          <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-lg">
            Occupied: <strong>{occupiedCount}</strong>
          </div>
          <div className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg">
            Turnover: <strong>{cleaningCount}</strong>
          </div>
        </div>
      </div>

      {/* Ward Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-700 mr-2">Filter Ward:</span>
        {[
          'All',
          'Emergency & Trauma Bay',
          'Maternal & ANC Ward',
          'General Inpatient Ward',
          'Pediatric Ward',
        ].map((w) => {
          const isActive = selectedWard === w;
          return (
            <button
              key={w}
              onClick={() => setSelectedWard(w)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {w}
            </button>
          );
        })}
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => {
          const patient = patients.find((p) => p.id === bed.currentPatientId);
          return (
            <div
              key={bed.id}
              className={`bg-white border rounded-xl p-5 space-y-3.5 shadow-2xs flex flex-col justify-between transition-colors ${
                bed.status === 'Occupied'
                  ? 'border-amber-300'
                  : bed.status === 'Available'
                  ? 'border-slate-200 hover:border-teal-300'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    {bed.bedNumber}
                  </span>
                  <span
                    className={`font-semibold text-[11px] ${
                      bed.status === 'Occupied'
                        ? 'text-amber-700'
                        : bed.status === 'Available'
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}
                  >
                    {bed.status}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-xs text-slate-700">
                    {bed.wardName}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                    Rate: NLe {bed.dailyRateNle} / day
                  </div>
                </div>

                {bed.status === 'Occupied' ? (
                  <div className="p-3 bg-amber-50/60 rounded-lg text-xs space-y-1 border border-amber-100">
                    <div className="font-bold text-slate-900">
                      {bed.currentPatientName || 'Admitted Patient'}
                    </div>
                    <div className="text-slate-600 font-mono text-[11px] tabular-nums">
                      ID: {bed.currentPatientHospitalNumber}
                    </div>
                    {bed.admissionDate && (
                      <div className="text-slate-500 text-[11px]">
                        Admitted: {new Date(bed.admissionDate).toLocaleDateString()}
                      </div>
                    )}
                    {bed.attendingDoctor && (
                      <div className="text-slate-600 text-[11px]">
                        Attending: {bed.attendingDoctor}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 text-center border border-slate-150">
                    {bed.status === 'Available' ? 'Ready for patient admission' : 'Under sanitization & bedsheet prep'}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                {bed.status === 'Occupied' ? (
                  <>
                    <button
                      onClick={() => patient && setSelectedPatientForDetail(patient)}
                      className="text-teal-700 hover:underline font-semibold cursor-pointer"
                    >
                      View Chart
                    </button>
                    <button
                      onClick={() => handleDischarge(bed.id)}
                      className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-semibold transition-colors cursor-pointer"
                    >
                      Discharge
                    </button>
                  </>
                ) : bed.status === 'Available' ? (
                  <button
                    onClick={() => {
                      setAdmittingBed(bed);
                      setAdmitPatientId(patients[0]?.id || '');
                    }}
                    className="w-full py-1.5 text-center font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Admit Patient to Bed
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkAvailable(bed.id)}
                    className="w-full py-1.5 text-center font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200 cursor-pointer"
                  >
                    Mark Clean & Available
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bed Admission Modal */}
      {admittingBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Admit Patient to Bed</h3>
                <p className="text-xs text-slate-500">
                  {admittingBed.bedNumber} · {admittingBed.wardName} (NLe {admittingBed.dailyRateNle}/day)
                </p>
              </div>
              <button
                onClick={() => setAdmittingBed(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAdmission} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Select Patient to Admit *</label>
                <select
                  value={admitPatientId}
                  onChange={(e) => setAdmitPatientId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                  required
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.hospitalNumber}) · {p.status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg text-slate-600 text-xs">
                Admission will allocate this bed and automatically link daily room charges (NLe {admittingBed.dailyRateNle}/day) to the patient's billing profile.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdmittingBed(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Confirm Bed Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
