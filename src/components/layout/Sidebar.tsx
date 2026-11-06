/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Left-Hand System Sidebar Navigation
 */

import React from 'react';
import { useHospital, NavigationTab } from '../../context/HospitalContext';
import {
  Activity,
  Users,
  Calendar,
  CreditCard,
  Scan,
  Pill,
  BedDouble,
  UserPlus,
  Info,
  PhoneCall,
  MapPin,
  RefreshCw,
  Heart,
  X,
  ShieldCheck,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

interface Props {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<Props> = ({ mobileOpen, setMobileOpen }) => {
  const {
    activeTab,
    setActiveTab,
    patients,
    appointments,
    invoices,
    encounters,
    setIsNewPatientModalOpen,
    setIsFlyerModalOpen,
    resetAllData,
  } = useHospital();

  // Badge calculations for live navigation indicators
  const totalPatients = patients.length;
  const pendingRxCount = encounters.reduce(
    (count, enc) => count + enc.prescriptions.filter((rx) => !rx.isDispensed).length,
    0
  );
  const todayAppointmentsCount = appointments.filter(
    (a) => a.status === 'Scheduled' || a.status === 'Checked In'
  ).length;
  const pendingBillsCount = invoices.filter((i) => i.balanceDueNle > 0).length;

  const navItems: {
    tab: NavigationTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    { tab: 'dashboard', label: 'Dashboard Overview', icon: Activity },
    { tab: 'patients', label: 'Patient EMR Records', icon: Users, badge: totalPatients },
    {
      tab: 'appointments',
      label: 'Appointment Schedule',
      icon: Calendar,
      badge: todayAppointmentsCount > 0 ? todayAppointmentsCount : undefined,
      badgeColor: 'bg-teal-100 text-teal-800',
    },
    {
      tab: 'billing',
      label: 'Billing & Invoices',
      icon: CreditCard,
      badge: pendingBillsCount > 0 ? pendingBillsCount : undefined,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    { tab: 'diagnostics', label: 'Ultrasound & Labs', icon: Scan },
    {
      tab: 'pharmacy',
      label: 'Pharmacy Dispensary',
      icon: Pill,
      badge: pendingRxCount > 0 ? `${pendingRxCount} Rx` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    { tab: 'wards', label: 'Inpatient Wards', icon: BedDouble },
  ];

  const handleNavClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Left-Hand Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 md:w-72 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand & Crest Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-md shrink-0">
              ✚
            </div>
            <div>
              <div className="text-sm font-bold text-white tracking-tight leading-tight">
                The Royal Agape
              </div>
              <div className="text-xs font-semibold text-teal-400">
                Medical Centre
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                HMIS · Freetown, SL
              </div>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Hotline Alert Box */}
        <div className="mx-3 mt-3 p-3 bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-teal-400 font-bold uppercase tracking-wider">
              24/7 Trauma Hotline
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <a
            href={`tel:${HOSPITAL_METADATA.phone1}`}
            className="block text-white font-mono font-bold text-xs tracking-wide hover:text-teal-300 transition-colors"
          >
            {HOSPITAL_METADATA.phone1}
          </a>
          <div className="text-[10px] text-slate-400 truncate">
            Kogbo 2, Ogoo Farm, Peninsular Rd
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => {
              setIsNewPatientModalOpen(true);
              setMobileOpen(false);
            }}
            className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register New Patient</span>
          </button>
        </div>

        {/* Navigation Menu Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            System Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => handleNavClick(item.tab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      isActive
                        ? 'bg-teal-700 text-white'
                        : item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Facility Information & Bottom Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
          {/* Official Banner Trigger */}
          <button
            onClick={() => {
              setIsFlyerModalOpen(true);
              setMobileOpen(false);
            }}
            className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer font-medium"
          >
            <Info className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">Facility Profile & Banner</span>
          </button>

          {/* Clinician Leadership Footnote */}
          <div className="px-2 pt-1 flex items-center justify-between text-[11px] text-slate-400">
            <div className="truncate">
              <span className="text-slate-200 font-semibold">{HOSPITAL_METADATA.leadership.ceo}</span>
              <div className="text-[10px] text-slate-500">{HOSPITAL_METADATA.leadership.title}</div>
            </div>

            <button
              onClick={() => {
                if (window.confirm('Reset all demonstration clinical records back to default seed state?')) {
                  resetAllData();
                }
              }}
              className="p-1.5 text-slate-500 hover:text-slate-300 rounded cursor-pointer"
              title="Reset Demo Records"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
