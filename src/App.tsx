/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Main Hospital Application Entry
 */

import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { PatientDirectory } from './components/patients/PatientDirectory';
import { AppointmentManager } from './components/appointments/AppointmentManager';
import { BillingManager } from './components/billing/BillingManager';
import { DiagnosticsManager } from './components/diagnostics/DiagnosticsManager';
import { PharmacyManager } from './components/pharmacy/PharmacyManager';
import { WardBedManager } from './components/wards/WardBedManager';
import { NewPatientModal } from './components/patients/NewPatientModal';
import { BookAppointmentModal } from './components/appointments/BookAppointmentModal';
import { NewInvoiceModal } from './components/billing/NewInvoiceModal';
import { InvoiceReceiptModal } from './components/billing/InvoiceReceiptModal';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { FacilityFlyerModal } from './components/facility/FacilityFlyerModal';
import { HOSPITAL_METADATA } from './data/mockData';
import { RefreshCw } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    isFlyerModalOpen,
    isNewPatientModalOpen,
    setIsNewPatientModalOpen,
    isBookAppointmentModalOpen,
    setIsBookAppointmentModalOpen,
    isNewInvoiceModalOpen,
    setIsNewInvoiceModalOpen,
    selectedInvoiceForPrint,
    setSelectedInvoiceForPrint,
    selectedPatientForDetail,
    setSelectedPatientForDetail,
    setIsFlyerModalOpen,
    resetAllData,
  } = useHospital();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900">
      {/* System Menu on the Left-Hand Side */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header & Breadcrumbs */}
        <Header onOpenMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Dynamic Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'patients' && <PatientDirectory />}
          {activeTab === 'appointments' && <AppointmentManager />}
          {activeTab === 'billing' && <BillingManager />}
          {activeTab === 'diagnostics' && <DiagnosticsManager />}
          {activeTab === 'pharmacy' && <PharmacyManager />}
          {activeTab === 'wards' && <WardBedManager />}
        </main>

        {/* Quiet Footer */}
        <footer className="no-print border-t border-slate-200 bg-white py-4 px-4 md:px-8 text-xs text-slate-500 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <strong className="text-slate-800">{HOSPITAL_METADATA.name}</strong>
              <span className="hidden sm:inline"> · </span>
              <span>{HOSPITAL_METADATA.address}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono tabular-nums text-slate-600">
                24/7 Hotline: {HOSPITAL_METADATA.phone1}
              </span>
              <span>·</span>
              <button
                onClick={() => setIsFlyerModalOpen(true)}
                className="text-teal-700 hover:underline cursor-pointer font-medium"
              >
                Official Flyer
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals & Slide-ins */}
      {isNewPatientModalOpen && (
        <NewPatientModal onClose={() => setIsNewPatientModalOpen(false)} />
      )}

      {isBookAppointmentModalOpen && (
        <BookAppointmentModal onClose={() => setIsBookAppointmentModalOpen(false)} />
      )}

      {isNewInvoiceModalOpen && (
        <NewInvoiceModal onClose={() => setIsNewInvoiceModalOpen(false)} />
      )}

      {selectedInvoiceForPrint && (
        <InvoiceReceiptModal
          invoice={selectedInvoiceForPrint}
          onClose={() => setSelectedInvoiceForPrint(null)}
        />
      )}

      {selectedPatientForDetail && (
        <PatientDetailModal
          patient={selectedPatientForDetail}
          onClose={() => setSelectedPatientForDetail(null)}
        />
      )}

      {isFlyerModalOpen && <FacilityFlyerModal />}
    </div>
  );
};

export default function App() {
  return (
    <HospitalProvider>
      <MainAppContent />
    </HospitalProvider>
  );
}
