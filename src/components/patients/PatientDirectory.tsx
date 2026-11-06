/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Patient EMR Directory
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient, PatientStatus } from '../../types/hmis';
import {
  Search,
  Filter,
  UserPlus,
  Baby,
  AlertCircle,
  FileText,
  Activity,
  Calendar,
  CreditCard,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const PatientDirectory: React.FC = () => {
  const {
    patients,
    setSelectedPatientForDetail,
    setIsNewPatientModalOpen,
    setIsBookAppointmentModalOpen,
  } = useHospital();

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'ANC' | 'Emergency' | 'Inpatient' | 'Outpatient'>('All');

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.fullName.toLowerCase().includes(search.toLowerCase()) ||
      patient.hospitalNumber.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search) ||
      patient.address.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filterCategory === 'ANC') return patient.isMaternalANC;
    if (filterCategory === 'Emergency') return patient.status === 'Emergency';
    if (filterCategory === 'Inpatient') return patient.status === 'Inpatient';
    if (filterCategory === 'Outpatient') return patient.status === 'Outpatient';

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Electronic Medical Records (EMR)
          </h1>
          <p className="text-xs text-slate-500">
            Master patient index, clinical encounter history, antenatal cards, and diagnostic tracking.
          </p>
        </div>

        <button
          onClick={() => setIsNewPatientModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search and Segmented Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, RAMC hospital number, phone, or address..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-slate-900"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 overflow-x-auto">
          {(['All', 'ANC', 'Emergency', 'Inpatient', 'Outpatient'] as const).map((cat) => {
            const isActive = filterCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ANC' ? 'Maternal ANC' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4">Hospital ID / Name</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Blood & Genotype</th>
                <th className="py-3 px-4">Clinical Category</th>
                <th className="py-3 px-4">Billing Profile</th>
                <th className="py-3 px-4">Last Visit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No patient records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setSelectedPatientForDetail(patient)}
                    >
                      {/* Name & Hospital Number */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                          {patient.fullName}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px] tabular-nums flex items-center gap-1.5">
                          <span>{patient.hospitalNumber}</span>
                          <span className="text-slate-300" aria-hidden="true">·</span>
                          <span className="truncate max-w-[140px]">{patient.phone}</span>
                        </div>
                      </td>

                      {/* Age / Gender */}
                      <td className="py-3.5 px-4 text-slate-700">
                        <div>{patient.age} yrs</div>
                        <div className="text-slate-500 text-[11px]">{patient.gender}</div>
                      </td>

                      {/* Blood Group & Genotype */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 font-mono tabular-nums">
                          {patient.bloodGroup}
                        </div>
                        <div className="text-slate-500 text-[11px] font-mono">
                          Hb: {patient.genotype}
                        </div>
                      </td>

                      {/* Clinical Category */}
                      <td className="py-3.5 px-4">
                        {patient.isMaternalANC ? (
                          <div className="space-y-0.5">
                            <span className="font-bold text-pink-700 flex items-center gap-1">
                              <Baby className="w-3.5 h-3.5" />
                              <span>ANC ({patient.ancDetails?.gestationalWeeks}wks)</span>
                            </span>
                            <div className="text-[11px] text-slate-500">
                              EDD: {patient.ancDetails?.edd}
                            </div>
                          </div>
                        ) : patient.status === 'Emergency' ? (
                          <span className="font-bold text-rose-700 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Emergency</span>
                          </span>
                        ) : patient.status === 'Inpatient' ? (
                          <span className="font-semibold text-amber-700">
                            Inpatient Ward
                          </span>
                        ) : (
                          <span className="text-slate-600 font-medium">
                            Outpatient (OPD)
                          </span>
                        )}
                      </td>

                      {/* Billing Profile */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="truncate max-w-[150px]">{patient.billingType}</div>
                        {patient.allergies.length > 0 && patient.allergies[0] !== 'None reported' && patient.allergies[0] !== 'None known' && (
                          <div className="text-[11px] text-rose-600 font-medium flex items-center gap-0.5 truncate max-w-[150px]">
                            <ShieldAlert className="w-3 h-3 shrink-0" />
                            <span>Allergy: {patient.allergies[0]}</span>
                          </div>
                        )}
                      </td>

                      {/* Last Visit */}
                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {patient.lastVisitDate}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPatientForDetail(patient);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors cursor-pointer"
                          >
                            Open Chart
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
