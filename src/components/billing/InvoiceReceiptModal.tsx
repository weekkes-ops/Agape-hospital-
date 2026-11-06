/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Official Hospital Invoice & Receipt
 */

import React from 'react';
import { Invoice } from '../../types/hmis';
import { X, Printer, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceReceiptModal: React.FC<Props> = ({ invoice, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="text-xs font-semibold">
            Official Hospital Invoice & Patient Receipt
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Container */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 overflow-y-auto max-h-[85vh] print-container">
          {/* Hospital Header & Crest */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-teal-700 text-white font-bold text-2xl mb-1 shadow-xs">
              ✚
            </div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
              {HOSPITAL_METADATA.name}
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {HOSPITAL_METADATA.address}
            </p>
            <div className="text-[11px] text-slate-500 font-mono flex flex-wrap items-center justify-center gap-2 pt-0.5">
              <span>Tel: {HOSPITAL_METADATA.phone1} / {HOSPITAL_METADATA.phone2}</span>
              <span>·</span>
              <span>Email: {HOSPITAL_METADATA.email}</span>
              <span>·</span>
              <span>Web: {HOSPITAL_METADATA.website}</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-teal-800 font-bold pt-1">
              Ministry of Health & Sanitation Registered Facility #{HOSPITAL_METADATA.registrationNumber}
            </div>
          </div>

          {/* Invoice Metadata Row */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Billed To</div>
              <div className="font-bold text-sm text-slate-900">{invoice.patientName}</div>
              <div className="font-mono text-slate-600">Hospital ID: {invoice.patientHospitalNumber}</div>
              <div className="text-slate-600">Tel: {invoice.patientPhone}</div>
            </div>

            <div className="text-right space-y-1">
              <div className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Receipt / Invoice</div>
              <div className="font-mono font-bold text-sm text-slate-900">{invoice.invoiceNumber}</div>
              <div className="text-slate-600">Issue Date: {invoice.date}</div>
              <div className="font-semibold text-teal-800">
                Status: {invoice.paymentStatus}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-2.5 px-3">Item / Service Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Amount (NLe)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {invoice.items.map((item) => (
                  <tr key={item.id} className="text-slate-800">
                    <td className="py-2.5 px-3 font-medium">{item.description}</td>
                    <td className="py-2.5 px-3 text-slate-500">{item.category}</td>
                    <td className="py-2.5 px-3 text-center font-mono tabular-nums">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">NLe {item.unitPriceNle}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">NLe {item.totalPriceNle}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Totals */}
          <div className="flex justify-end text-xs">
            <div className="w-64 space-y-1.5 font-mono tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>NLe {invoice.subtotalNle.toLocaleString()}</span>
              </div>
              {invoice.discountNle > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Agape Subsidy / Discount:</span>
                  <span>- NLe {invoice.discountNle.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-300 pt-1.5">
                <span>Total Amount:</span>
                <span>NLe {invoice.totalNle.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-semibold text-emerald-700">NLe {invoice.amountPaidNle.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm border-t border-slate-200 pt-1 text-slate-900">
                <span>Balance Due:</span>
                <span className={invoice.balanceDueNle > 0 ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                  NLe {invoice.balanceDueNle.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Notes & Stamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-slate-900">Payment & Settlement Information:</div>
              <p className="text-slate-600 text-[11px]">
                {invoice.notes || 'Official transaction verified.'}
              </p>
              {invoice.paymentMethod && (
                <div className="text-[11px] font-mono text-slate-600">
                  Method: <strong>{invoice.paymentMethod}</strong> (Ref: {invoice.paymentReference || 'N/A'})
                </div>
              )}
            </div>

            <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center flex flex-col items-center justify-center">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Official Hospital Cashier Stamp / Signature
              </div>
              <div className="text-xs font-bold text-teal-800 mt-1 font-serif">
                THE ROYAL AGAPE MEDICAL CENTRE
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Date: {invoice.date} · Accounts Dept
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
