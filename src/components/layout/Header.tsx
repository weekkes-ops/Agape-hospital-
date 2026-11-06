/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Top Breadcrumbs & Global Search Header
 */

import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Patient } from '../../types/hmis';
import {
  Menu,
  Calendar,
  Banknote,
  PhoneCall,
  Search,
  Info,
  X,
  User,
  Baby,
  AlertCircle,
  ChevronRight,
  UserPlus,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

interface Props {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<Props> = ({ onOpenMobileSidebar }) => {
  const {
    activeTab,
    setActiveTab,
    patients,
    setSelectedPatientForDetail,
    setIsNewPatientModalOpen,
    setIsBookAppointmentModalOpen,
    setIsNewInvoiceModalOpen,
    setIsFlyerModalOpen,
  } = useHospital();

  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabLabels: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Clinical Operations Overview', subtitle: 'Live hospital census, triage monitor, and collections' },
    patients: { title: 'Patient Electronic Medical Records (EMR)', subtitle: 'Master patient index, vital signs charting, and SOAP notes' },
    appointments: { title: 'Appointment Scheduling & Clinic Flow', subtitle: 'Physician bookings, antenatal slots, and ultrasound scans' },
    billing: { title: 'Automated Billing & Revenue Reconciliation', subtitle: 'Itemized fee ledgers, insurance claims, and receipts' },
    diagnostics: { title: 'Ultrasound Sonography & Biomedical Laboratory', subtitle: 'Digital ultrasound reports and laboratory investigations' },
    pharmacy: { title: 'Pharmacy & Clinical Dispensary', subtitle: 'Prescription fulfillment queue and formulary stock tracking' },
    wards: { title: 'Inpatient Wards & 24/7 Emergency Beds', subtitle: 'Bed occupancy status, maternal wards, and trauma observation' },
  };

  const current = tabLabels[activeTab] || { title: 'Hospital Management', subtitle: 'Clinical information system' };

  // Global search filtering
  const searchResults = searchQuery.trim()
    ? patients.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        return (
          p.fullName.toLowerCase().includes(q) ||
          p.hospitalNumber.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.ancDetails && 'anc'.includes(q))
        );
      })
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Ctrl+K or / to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsDropdownOpen(true);
      } else if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatientForDetail(patient);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0 shrink-0">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer shrink-0"
          title="Open System Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 hidden sm:block">
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span className="font-semibold text-teal-700 truncate">The Royal Agape</span>
            <span aria-hidden="true">/</span>
            <span className="capitalize">{activeTab}</span>
          </div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Middle: Global Patient Quick Search Bar */}
      <div className="relative flex-1 max-w-md mx-auto">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
            placeholder="Search patient by name or ID (e.g. Aminata, RAMC-26-0041)..."
            className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 shadow-2xs transition-colors"
          />
          <div className="absolute right-2.5 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-200/60 border border-slate-300 rounded shadow-2xs">
                ⌘K
              </kbd>
            )}
          </div>
        </div>

        {/* Floating Dropdown Results */}
        {isDropdownOpen && searchQuery.trim().length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 max-h-96 overflow-y-auto"
          >
            <div className="p-2.5 bg-slate-50 text-[11px] font-semibold text-slate-500 flex items-center justify-between">
              <span>Matching Patients ({searchResults.length})</span>
              <span className="text-[10px] text-slate-400">Click to open full clinical EMR chart</span>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-6 text-center text-xs space-y-2">
                <div className="text-slate-500">
                  No patient found matching <strong className="text-slate-800">"{searchQuery}"</strong>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsNewPatientModalOpen(true);
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register as New Patient</span>
                </button>
              </div>
            ) : (
              searchResults.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="p-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                      {patient.fullName
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                        <span>{patient.fullName}</span>
                        {patient.isMaternalANC && (
                          <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-1.5 py-0.2 rounded border border-pink-200 flex items-center gap-0.5 shrink-0">
                            <Baby className="w-2.5 h-2.5" /> ANC
                          </span>
                        )}
                        {patient.status === 'Emergency' && (
                          <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 flex items-center gap-0.5 shrink-0">
                            <AlertCircle className="w-2.5 h-2.5" /> Emergency
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono tabular-nums flex items-center gap-2 truncate">
                        <span className="font-semibold text-teal-800">{patient.hospitalNumber}</span>
                        <span>·</span>
                        <span>{patient.age} yrs ({patient.gender})</span>
                        <span>·</span>
                        <span>{patient.phone}</span>
                        <span>·</span>
                        <span>Blood: {patient.bloodGroup}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 shrink-0">
                    <span className="text-[11px] text-teal-700 font-semibold hidden sm:inline">Open Chart</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}

            {searchResults.length > 0 && (
              <div className="p-2 bg-slate-50 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setActiveTab('patients');
                  }}
                  className="text-xs text-teal-700 hover:underline font-semibold cursor-pointer"
                >
                  View all in Patient EMR Directory →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Hotline & Quick Shortcuts */}
      <div className="flex items-center gap-2 shrink-0">
        <a
          href={`tel:${HOSPITAL_METADATA.phone1}`}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors font-mono tabular-nums"
          title="Call Emergency Line"
        >
          <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
          <span>{HOSPITAL_METADATA.phone1}</span>
        </a>

        <button
          onClick={() => setIsBookAppointmentModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>Schedule</span>
        </button>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Banknote className="w-3.5 h-3.5 text-slate-500" />
          <span>Create Bill</span>
        </button>

        <button
          onClick={() => setIsFlyerModalOpen(true)}
          className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors cursor-pointer"
          title="Facility Profile & Official Banner"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
