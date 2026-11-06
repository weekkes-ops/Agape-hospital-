/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - New Patient Registration Modal
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { BloodGroup, Genotype, BillingType, PatientStatus } from '../../types/hmis';
import { X, UserPlus, Baby, ShieldAlert } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const NewPatientModal: React.FC<Props> = ({ onClose }) => {
  const { addPatient, setSelectedPatientForDetail } = useHospital();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [phone, setPhone] = useState('+232 ');
  const [address, setAddress] = useState('Ogoo Farm, Peninsular Road, Freetown');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [genotype, setGenotype] = useState<Genotype>('AA');
  const [allergiesInput, setAllergiesInput] = useState('None reported');
  const [conditionsInput, setConditionsInput] = useState('None');
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState('Spouse / Family');
  const [contactPhone, setContactPhone] = useState('+232 ');
  const [billingType, setBillingType] = useState<BillingType>('Self-Pay (Cash/Mobile Money)');
  const [status, setStatus] = useState<PatientStatus>('Outpatient');

  // Maternal ANC Toggle
  const [isMaternalANC, setIsMaternalANC] = useState(false);
  const [gravida, setGravida] = useState(1);
  const [para, setPara] = useState(0);
  const [gestationalWeeks, setGestationalWeeks] = useState(16);
  const [edd, setEdd] = useState('2026-09-15');
  const [riskLevel, setRiskLevel] = useState<'Low' | 'Moderate' | 'High'>('Low');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const allergies = allergiesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const chronicConditions = conditionsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const created = addPatient({
      fullName: fullName.trim(),
      age: Number(age),
      gender,
      phone: phone.trim(),
      address: address.trim(),
      bloodGroup,
      genotype,
      allergies: allergies.length > 0 ? allergies : ['None reported'],
      chronicConditions: chronicConditions.length > 0 ? chronicConditions : ['None'],
      emergencyContact: {
        name: contactName.trim() || 'Next of Kin',
        relation: contactRelation.trim(),
        phone: contactPhone.trim() || phone.trim(),
      },
      billingType,
      status,
      isMaternalANC,
      ancDetails: isMaternalANC
        ? {
            gravida: Number(gravida),
            para: Number(para),
            gestationalWeeks: Number(gestationalWeeks),
            edd,
            riskLevel,
          }
        : undefined,
    });

    onClose();
    // Open newly created patient's chart
    setSelectedPatientForDetail(created);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-teal-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-teal-300" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">New Patient Clinical Registration</h2>
              <p className="text-xs text-teal-200">The Royal Agape Medical Centre · Patient Record Initiation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-teal-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[82vh] overflow-y-auto text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">Full Legal Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Marie Koroma"
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Age *</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={0}
                max={120}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-teal-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Gender *</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Phone Number *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+232 78 123 456"
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:bg-white focus:ring-1 focus:ring-teal-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Admission Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PatientStatus)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:outline-none"
              >
                <option value="Outpatient">Outpatient (OPD)</option>
                <option value="Emergency">Emergency / Trauma</option>
                <option value="Inpatient">Inpatient Ward</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Residential Address (Freetown / Western Area)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Kogbo 2, Ogoo Farm, Peninsular Road"
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white focus:ring-1 focus:ring-teal-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              >
                {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as const).map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Genotype (Hb)</label>
              <select
                value={genotype}
                onChange={(e) => setGenotype(e.target.value as Genotype)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              >
                {(['AA', 'AS', 'SS', 'AC'] as const).map((gt) => (
                  <option key={gt} value={gt}>{gt}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-800 mb-1">Billing Arrangement</label>
              <select
                value={billingType}
                onChange={(e) => setBillingType(e.target.value as BillingType)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="Self-Pay (Cash/Mobile Money)">Self-Pay (Cash/Mobile Money)</option>
                <option value="National Health / Insurance">National Health / Insurance</option>
                <option value="Corporate Partner">Corporate Partner</option>
                <option value="Agape Subsidized Care">Agape Subsidized Care</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">Known Allergies (Comma separated)</label>
              <input
                type="text"
                value={allergiesInput}
                onChange={(e) => setAllergiesInput(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa, None"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Chronic Conditions (Comma separated)</label>
              <input
                type="text"
                value={conditionsInput}
                onChange={(e) => setConditionsInput(e.target.value)}
                placeholder="e.g. Hypertension, Asthma, None"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Maternal Antenatal (ANC) Service Toggle */}
          <div className="p-3 bg-pink-50/70 border border-pink-200 rounded-xl space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isMaternalANC}
                onChange={(e) => setIsMaternalANC(e.target.checked)}
                className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4"
              />
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-pink-600" />
                <span>Register into Maternal (ANC) & Child Health Program</span>
              </span>
            </label>

            {isMaternalANC && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Gravida</label>
                  <input
                    type="number"
                    value={gravida}
                    onChange={(e) => setGravida(Number(e.target.value))}
                    min={1}
                    className="w-full p-1.5 bg-white border border-pink-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Para</label>
                  <input
                    type="number"
                    value={para}
                    onChange={(e) => setPara(Number(e.target.value))}
                    min={0}
                    className="w-full p-1.5 bg-white border border-pink-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Gestational Wks</label>
                  <input
                    type="number"
                    value={gestationalWeeks}
                    onChange={(e) => setGestationalWeeks(Number(e.target.value))}
                    min={4}
                    max={42}
                    className="w-full p-1.5 bg-white border border-pink-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">EDD Date</label>
                  <input
                    type="date"
                    value={edd}
                    onChange={(e) => setEdd(e.target.value)}
                    className="w-full p-1.5 bg-white border border-pink-200 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full p-1.5 bg-white border border-pink-200 rounded"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="font-semibold text-slate-800">Next of Kin / Emergency Contact</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Contact full name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded text-slate-900"
              />
              <input
                type="text"
                placeholder="Relationship (e.g. Spouse)"
                value={contactRelation}
                onChange={(e) => setContactRelation(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded text-slate-900"
              />
              <input
                type="text"
                placeholder="Contact phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="p-2 bg-white border border-slate-200 rounded text-slate-900 font-mono"
              />
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
              Complete Registration & Open Chart
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
