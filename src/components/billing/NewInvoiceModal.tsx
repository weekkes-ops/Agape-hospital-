/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Create New Bill Modal
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { InvoiceItem, PaymentMethod, PaymentStatus } from '../../types/hmis';
import { X, Plus, Trash2, Banknote } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const PRESET_FEES: { label: string; category: InvoiceItem['category']; fee: number }[] = [
  { label: 'Outpatient General Consultation (OPD)', category: 'Consultation', fee: 150 },
  { label: 'Specialist / CEO Medical Consultation', category: 'Consultation', fee: 250 },
  { label: '24/7 Emergency Triage & Resuscitation', category: 'Emergency', fee: 300 },
  { label: 'Obstetric / Pregnancy Ultrasound Scan', category: 'Ultrasound', fee: 280 },
  { label: 'Abdominal & Pelvic Ultrasound Scan', category: 'Ultrasound', fee: 320 },
  { label: 'Malaria Rapid Test (RDT) + Blood Smear', category: 'Laboratory', fee: 85 },
  { label: 'Complete Blood Count (CBC/FBC)', category: 'Laboratory', fee: 180 },
  { label: 'Widal Typhoid Agglutination Test', category: 'Laboratory', fee: 95 },
  { label: 'Urinalysis 10-Parameter Strip', category: 'Laboratory', fee: 60 },
  { label: 'Wound Debridement & Minor Suturing', category: 'Procedure', fee: 350 },
  { label: 'Inpatient Observation Bed (Per Day)', category: 'Ward / Bed', fee: 250 },
  { label: 'Maternal ANC Ward Stay (Per Day)', category: 'Ward / Bed', fee: 280 },
  { label: 'IV Infusion + Normal Saline Pack', category: 'Pharmacy', fee: 90 },
];

export const NewInvoiceModal: React.FC<Props> = ({ onClose }) => {
  const { patients, createInvoice, setSelectedInvoiceForPrint } = useHospital();

  const [patientId, setPatientId] = useState(patients[0]?.id || '');
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: `item-${Date.now()}`,
      description: 'Outpatient General Consultation (OPD)',
      category: 'Consultation',
      quantity: 1,
      unitPriceNle: 150,
      totalPriceNle: 150,
    },
  ]);
  const [discountNle, setDiscountNle] = useState(0);
  const [amountPaidNle, setAmountPaidNle] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');

  const selectedPatient = patients.find((p) => p.id === patientId);

  const handleAddItem = (preset?: typeof PRESET_FEES[0]) => {
    if (preset) {
      setItems((prev) => [
        ...prev,
        {
          id: `item-${Date.now()}-${prev.length}`,
          description: preset.label,
          category: preset.category,
          quantity: 1,
          unitPriceNle: preset.fee,
          totalPriceNle: preset.fee,
        },
      ]);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: `item-${Date.now()}-${prev.length}`,
          description: 'Custom Clinical Service',
          category: 'Procedure',
          quantity: 1,
          unitPriceNle: 100,
          totalPriceNle: 100,
        },
      ]);
    }
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, ...updates };
          updated.totalPriceNle = (updated.quantity || 1) * (updated.unitPriceNle || 0);
          return updated;
        }
        return it;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const subtotal = items.reduce((sum, it) => sum + it.totalPriceNle, 0);
  const total = Math.max(0, subtotal - discountNle);
  const balanceDue = Math.max(0, total - amountPaidNle);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient || items.length === 0) return;

    let paymentStatus: PaymentStatus = 'Pending';
    if (selectedPatient.billingType.includes('Insurance')) {
      paymentStatus = 'Insurance Claim';
    } else if (balanceDue <= 0 && total > 0) {
      paymentStatus = 'Paid';
    } else if (amountPaidNle > 0) {
      paymentStatus = 'Partially Paid';
    }

    const today = new Date().toISOString().split('T')[0];
    const created = createInvoice({
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      patientHospitalNumber: selectedPatient.hospitalNumber,
      patientPhone: selectedPatient.phone,
      date: today,
      dueDate: today,
      items,
      discountNle,
      taxNle: 0,
      amountPaidNle,
      paymentStatus,
      paymentMethod: amountPaidNle > 0 ? paymentMethod : undefined,
      paymentReference: paymentReference || undefined,
      notes: notes || 'Hospital services rendered.',
    });

    onClose();
    setSelectedInvoiceForPrint(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
        <div className="p-4 sm:p-5 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="text-base font-bold">Generate Patient Hospital Bill</h2>
              <p className="text-xs text-teal-200">The Royal Agape Medical Centre · Automated Invoicing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {/* Patient Selection */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Select Patient *</label>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              required
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName} ({p.hospitalNumber}) · {p.billingType}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Add Preset Buttons */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Quick Add Royal Agape Service Fees:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_FEES.slice(0, 6).map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAddItem(preset)}
                  className="px-2 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                >
                  + {preset.label} (NLe {preset.fee})
                </button>
              ))}
            </div>
          </div>

          {/* Itemized Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Itemized Charges</span>
              <button
                type="button"
                onClick={() => handleAddItem()}
                className="text-teal-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Custom Item
              </button>
            </div>

            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden">
              {items.map((it) => (
                <div key={it.id} className="p-2.5 flex items-center gap-2 bg-white">
                  <input
                    type="text"
                    value={it.description}
                    onChange={(e) => handleUpdateItem(it.id, { description: e.target.value })}
                    className="flex-1 p-1.5 border border-slate-200 rounded text-slate-900"
                    placeholder="Description"
                    required
                  />
                  <div className="w-16">
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => handleUpdateItem(it.id, { quantity: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-200 rounded text-center font-mono tabular-nums text-slate-900"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      min={0}
                      value={it.unitPriceNle}
                      onChange={(e) => handleUpdateItem(it.id, { unitPriceNle: Number(e.target.value) })}
                      className="w-full p-1.5 border border-slate-200 rounded text-right font-mono tabular-nums text-slate-900"
                    />
                  </div>
                  <div className="w-24 text-right font-mono font-bold tabular-nums text-slate-900">
                    NLe {it.totalPriceNle}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(it.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Immediate Payment Collection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
            <div className="space-y-2">
              <label className="block font-semibold text-slate-800">Initial Payment Settled Now</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  value={amountPaidNle}
                  onChange={(e) => setAmountPaidNle(Number(e.target.value))}
                  placeholder="Amount Paid"
                  className="p-2 border border-slate-200 rounded font-mono tabular-nums text-slate-900"
                />
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="p-2 border border-slate-200 rounded text-slate-900 font-medium"
                >
                  <option value="Cash">Cash</option>
                  <option value="Orange Money">Orange Money</option>
                  <option value="Afrimoney">Afrimoney</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Payment Reference / Mobile Money TxID (optional)"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="w-full p-2 border border-slate-200 rounded font-mono text-slate-900"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 font-mono tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>NLe {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>Discount / Subsidy:</span>
                <input
                  type="number"
                  min={0}
                  value={discountNle}
                  onChange={(e) => setDiscountNle(Number(e.target.value))}
                  className="w-20 p-1 text-right bg-white border border-slate-200 rounded"
                />
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1 text-sm">
                <span>Total Due:</span>
                <span>NLe {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-rose-600">
                <span>Remaining Balance:</span>
                <span>NLe {balanceDue.toLocaleString()}</span>
              </div>
            </div>
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
              Issue Invoice & Print Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
