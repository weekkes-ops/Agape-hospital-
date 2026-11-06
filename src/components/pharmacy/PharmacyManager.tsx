/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Pharmacy & Dispensary Manager
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { PharmacyItem } from '../../types/hmis';
import {
  Pill,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Package,
  ShieldAlert,
} from 'lucide-react';

export const PharmacyManager: React.FC = () => {
  const { pharmacy, encounters, patients, dispensePrescription } = useHospital();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Collect all unfulfilled prescriptions across all patient encounters
  const pendingPrescriptions: {
    encounterId: string;
    patientId: string;
    patientName: string;
    hospitalNumber: string;
    doctorName: string;
    date: string;
    rx: {
      id: string;
      medication: string;
      dosage: string;
      frequency: string;
      duration: string;
      unitPriceNle: number;
      instructions: string;
      isDispensed: boolean;
    };
  }[] = [];

  encounters.forEach((enc) => {
    const patient = patients.find((p) => p.id === enc.patientId);
    enc.prescriptions.forEach((rx) => {
      pendingPrescriptions.push({
        encounterId: enc.id,
        patientId: enc.patientId,
        patientName: patient?.fullName || 'Unknown Patient',
        hospitalNumber: patient?.hospitalNumber || '',
        doctorName: enc.doctorName,
        date: enc.date,
        rx,
      });
    });
  });

  const unfulfilledRx = pendingPrescriptions.filter((p) => !p.rx.isDispensed);
  const fulfilledRx = pendingPrescriptions.filter((p) => p.rx.isDispensed);

  const filteredPharmacy = pharmacy.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.genericName.toLowerCase().includes(search.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory !== 'All' && item.category !== filterCategory) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Pharmacy & Clinical Dispensary
          </h1>
          <p className="text-xs text-slate-500">
            Formulary inventory control, automated dispensing queues, and stock depletion tracking.
          </p>
        </div>

        <div className="text-xs font-mono tabular-nums text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs">
          Active Stock Items: <strong className="text-slate-900">{pharmacy.length}</strong>
        </div>
      </div>

      {/* Prescription Queue Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Active Prescription Fulfillment Queue ({unfulfilledRx.length} Pending)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Auto-linked from Physician SOAP Notes
          </span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {unfulfilledRx.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              All clinical prescriptions have been dispensed. No pending dispensary orders.
            </div>
          ) : (
            unfulfilledRx.map((item) => (
              <div
                key={item.rx.id}
                className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.rx.medication}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="text-slate-600 font-medium">{item.rx.dosage}</span>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <span className="font-mono text-slate-500 tabular-nums">{item.rx.frequency} ({item.rx.duration})</span>
                  </div>

                  <div className="text-slate-600 text-xs">
                    Patient: <strong>{item.patientName}</strong> ({item.hospitalNumber}) · Prescribed by {item.doctorName}
                  </div>

                  {item.rx.instructions && (
                    <div className="text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded inline-block">
                      Label: {item.rx.instructions}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono font-bold text-slate-900 tabular-nums">
                    NLe {item.rx.unitPriceNle}
                  </span>
                  <button
                    onClick={() => dispensePrescription(item.encounterId, item.rx.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Dispense & Deduct Stock</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Formulary Stock Inventory Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search formulary by brand, generic name, or batch..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Filter Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="All">All Categories</option>
              <option value="Antimalarial">Antimalarial</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Analgesic / Anti-inflammatory">Analgesic</option>
              <option value="Prenatal / Vitamin">Prenatal / Vitamin</option>
              <option value="Antihypertensive">Antihypertensive</option>
              <option value="IV Fluid">IV Infusion</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4">Medication / Generic</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dosage Form</th>
                  <th className="py-3 px-4 text-center">Stock Level</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Batch #</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPharmacy.map((item) => {
                  const isLow = item.stockQuantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-500">{item.genericName} ({item.strength})</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-700">
                        {item.category}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {item.dosageForm}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono tabular-nums">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-xs ${
                            isLow
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.stockQuantity} units
                        </span>
                        {isLow && (
                          <div className="text-[10px] text-rose-600 font-semibold mt-0.5">
                            Reorder Trigger ({item.reorderLevel})
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        NLe {item.unitPriceNle}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 tabular-nums">
                        {item.expiryDate}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                        {item.batchNumber}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
