/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Navigation Bar
 */

import React from 'react';
import { useHospital, NavigationTab } from '../../context/HospitalContext';
import {
  Activity,
  Users,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Pill,
  BedDouble,
  UserPlus,
  Info,
  PhoneCall,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsNewPatientModalOpen,
    setIsFlyerModalOpen,
  } = useHospital();

  const navItems: { tab: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { tab: 'dashboard', label: 'Overview', icon: Activity },
    { tab: 'patients', label: 'Patients (EMR)', icon: Users },
    { tab: 'appointments', label: 'Appointments', icon: Calendar },
    { tab: 'billing', label: 'Billing & Claims', icon: CreditCard },
    { tab: 'diagnostics', label: 'Ultrasound & Labs', icon: FileSpreadsheet },
    { tab: 'pharmacy', label: 'Pharmacy', icon: Pill },
    { tab: 'wards', label: 'Inpatient Wards', icon: BedDouble },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Emergency & Facility Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 md:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-teal-400 tracking-wide uppercase text-[11px]">24/7 Emergency & Trauma Care</span>
          <span className="text-slate-500" aria-hidden="true">·</span>
          <span className="text-slate-300 hidden sm:inline">{HOSPITAL_METADATA.address}</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`tel:${HOSPITAL_METADATA.phone1.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1.5 text-teal-300 hover:text-white transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums">{HOSPITAL_METADATA.phone1}</span>
          </a>
          <span className="text-slate-600 hidden md:inline">|</span>
          <button
            onClick={() => setIsFlyerModalOpen(true)}
            className="text-xs text-slate-300 hover:text-white flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Facility Profile & Official Banner</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: 3 Zones */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold shadow-xs">
            <span className="text-lg leading-none">✚</span>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-base sm:text-lg font-bold text-slate-900 tracking-tight whitespace-nowrap group-hover:text-teal-700 transition-colors">
              The Royal Agape Medical Centre
            </div>
            <div className="text-[11px] text-slate-500 font-medium tracking-wide">
              HMIS Clinical & Hospital Information System
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`px-3 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewPatientModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors shadow-2xs flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register Patient</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden border-t border-slate-200 px-4 py-2 bg-slate-50 overflow-x-auto flex items-center gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
