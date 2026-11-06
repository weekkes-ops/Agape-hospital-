/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Automated Billing & Invoicing Manager
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { Invoice, PaymentMethod, PaymentStatus } from '../../types/hmis';
import {
  Banknote,
  Search,
  Filter,
  CreditCard,
  Plus,
  Printer,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  X,
} from 'lucide-react';

export const BillingManager: React.FC = () => {
  const {
    invoices,
    patients,
    recordInvoicePayment,
    setSelectedInvoiceForPrint,
    setIsNewInvoiceModalOpen,
  } = useHospital();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'All'>('All');

  // Record Payment Modal State
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Orange Money');
  const [payRef, setPayRef] = useState('');

  // Calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalNle, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.amountPaidNle, 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.balanceDueNle, 0);
  const insuranceCount = invoices.filter((i) => i.paymentStatus === 'Insurance Claim').length;

  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientHospitalNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.patientPhone.includes(search);

    if (!matchesSearch) return false;
    if (filterStatus !== 'All' && inv.paymentStatus !== filterStatus) return false;
    return true;
  });

  const handleOpenPayment = (inv: Invoice) => {
    setPayingInvoice(inv);
    setPayAmount(inv.balanceDueNle);
    setPayRef(`TXN-${Date.now().toString().slice(-6)}`);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingInvoice || payAmount <= 0) return;

    recordInvoicePayment(payingInvoice.id, payAmount, payMethod, payRef);
    setPayingInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Automated Hospital Billing & Revenue Management
          </h1>
          <p className="text-xs text-slate-500">
            Real-time fee reconciliation for consultations, diagnostics, pharmacy dispensing, and ward admissions.
          </p>
        </div>

        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Bill</span>
        </button>
      </div>

      {/* Financial Health KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Total Billed Revenue</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            NLe {totalBilled.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Gross Clinical Invoices</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-emerald-700 font-semibold">Total Payments Collected</div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            NLe {totalCollected.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cash & Mobile Money</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-rose-600 font-semibold">Outstanding Receivables</div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 font-mono tabular-nums mt-1">
            NLe {totalOutstanding.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pending Patient Balances</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-indigo-700 font-semibold">Insurance Claims</div>
          <div className="text-xl sm:text-2xl font-bold text-indigo-900 font-mono tabular-nums mt-1">
            {insuranceCount} Invoices
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Under Carrier Adjudication</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices by number (e.g. RAMC-INV-2026-0182), patient name, or phone..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 overflow-x-auto">
          {(['All', 'Paid', 'Partially Paid', 'Pending', 'Insurance Claim'] as const).map((status) => {
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Invoices Master Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4">Invoice # / Date</th>
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Itemized Services</th>
                <th className="py-3 px-4 text-right">Total Bill</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No hospital invoices match the query.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 tabular-nums">
                        {inv.invoiceNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">{inv.date}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{inv.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                        {inv.patientHospitalNumber}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="truncate max-w-[200px]">
                        {inv.items.map((it) => it.description).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {inv.items.length} billable items
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      NLe {inv.totalNle.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                      NLe {inv.amountPaidNle.toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold">
                      <span className={inv.balanceDueNle > 0 ? 'text-rose-600' : 'text-slate-400'}>
                        NLe {inv.balanceDueNle.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-semibold ${
                          inv.paymentStatus === 'Paid'
                            ? 'text-emerald-700'
                            : inv.paymentStatus === 'Partially Paid'
                            ? 'text-amber-700'
                            : inv.paymentStatus === 'Insurance Claim'
                            ? 'text-indigo-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                      {inv.paymentMethod && (
                        <div className="text-[10px] text-slate-500">
                          via {inv.paymentMethod}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.balanceDueNle > 0 && (
                          <button
                            onClick={() => handleOpenPayment(inv)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                          >
                            Pay
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors flex items-center gap-1 cursor-pointer"
                          title="View / Print Official Receipt"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Receipt</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Sub-Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Record Patient Settlement</h3>
                <p className="text-xs text-slate-500">
                  Invoice {payingInvoice.invoiceNumber} · {payingInvoice.patientName}
                </p>
              </div>
              <button
                onClick={() => setPayingInvoice(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-3 text-xs">
              <div>
                <div className="text-slate-600 mb-1">Total Outstanding Balance:</div>
                <div className="text-lg font-bold font-mono text-rose-600 tabular-nums">
                  NLe {payingInvoice.balanceDueNle.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Amount Receiving (NLe) *</label>
                <input
                  type="number"
                  min={1}
                  max={payingInvoice.balanceDueNle}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  required
                  className="w-full p-2 border border-slate-200 rounded font-mono font-bold text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900 font-medium"
                >
                  <option value="Orange Money">Orange Money Mobile Wallet</option>
                  <option value="Afrimoney">Afrimoney Mobile Wallet</option>
                  <option value="Cash">Physical Cash Settlement</option>
                  <option value="Bank Transfer">Commercial Bank Direct Transfer</option>
                  <option value="Insurance">Health Insurance Adjudication</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Transaction Ref / Cashier Slip #</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded font-mono text-slate-900"
                  placeholder="e.g. OM-TXN-884102"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Confirm & Post Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
