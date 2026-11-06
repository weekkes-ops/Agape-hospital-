/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Diagnostic Ultrasound & Laboratory Center
 */

import React, { useState } from 'react';
import { useHospital } from '../../context/HospitalContext';
import { UltrasoundReport, LabInvestigation } from '../../types/hmis';
import {
  Scan,
  FlaskConical,
  Plus,
  Printer,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Baby,
  FileText,
  User,
  X,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

export const DiagnosticsManager: React.FC = () => {
  const {
    ultrasounds,
    labs,
    patients,
    addUltrasoundReport,
    addLabInvestigation,
    updateLabStatus,
    selectedUltrasoundForView,
    setSelectedUltrasoundForView,
  } = useHospital();

  const [activeSection, setActiveSection] = useState<'ultrasound' | 'lab'>('ultrasound');
  const [isNewUltrasoundModalOpen, setIsNewUltrasoundModalOpen] = useState(false);
  const [isNewLabModalOpen, setIsNewLabModalOpen] = useState(false);

  // New Ultrasound Form state
  const [usPatientId, setUsPatientId] = useState(patients[0]?.id || '');
  const [usExamType, setUsExamType] = useState<UltrasoundReport['examType']>('Obstetric Ultrasound (ANC)');
  const [usIndication, setUsIndication] = useState('Routine antenatal fetal anatomy & biometry scan');
  const [usImpression, setUsImpression] = useState('');
  const [usSonologist, setUsSonologist] = useState('Dr. Mariama Jalloh, DMRD (Senior Sonologist)');
  const [usFee, setUsFee] = useState(280);
  const [usGaWeeks, setUsGaWeeks] = useState(24);
  const [usFhr, setUsFhr] = useState(145);
  const [usPlacenta, setUsPlacenta] = useState('Posterior, high clear of internal os');
  const [usAfi, setUsAfi] = useState('Adequate volume (13.5 cm)');

  // New Lab Form state
  const [labPatientId, setLabPatientId] = useState(patients[0]?.id || '');
  const [labTestName, setLabTestName] = useState('Malaria Parasite (Rapid Test & Giemsa Microscopy)');
  const [labCategory, setLabCategory] = useState<LabInvestigation['category']>('Parasitology & Rapid Tests');
  const [labDoctor, setLabDoctor] = useState('Dr. Patrick Conteh, FWACP');
  const [labFee, setLabFee] = useState(85);

  const handleCreateUltrasound = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === usPatientId);
    if (!patient) return;

    const today = new Date().toISOString().split('T')[0];
    const created = addUltrasoundReport({
      patientId: patient.id,
      patientName: patient.fullName,
      patientHospitalNumber: patient.hospitalNumber,
      patientAge: patient.age,
      examDate: today,
      examType: usExamType,
      referringDoctor: 'Clinical Department',
      sonologist: usSonologist,
      clinicalIndication: usIndication,
      findings: {
        gestationalAgeWeeks: usGaWeeks,
        fetalHeartRateBpm: usFhr,
        placentaLocation: usPlacenta,
        amnioticFluidIndex: usAfi,
        organDetails: 'Visualized fetal and maternal anatomical structures within normal morphological limits.',
      },
      impression: usImpression || 'Sonographic parameters consistent with clinical dates. Normal progression.',
      recommendations: 'Follow up with attending clinician.',
      status: 'Verified / Completed',
      feeNle: Number(usFee),
    });

    setIsNewUltrasoundModalOpen(false);
    setSelectedUltrasoundForView(created);
  };

  const handleCreateLab = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === labPatientId);
    if (!patient) return;

    addLabInvestigation({
      patientId: patient.id,
      patientName: patient.fullName,
      patientHospitalNumber: patient.hospitalNumber,
      testName: labTestName,
      category: labCategory,
      orderedDate: new Date().toISOString(),
      orderedBy: labDoctor,
      status: 'Ordered',
      feeNle: Number(labFee),
      results: [],
      clinicalNotes: 'Specimen bottle issued to phlebotomy bench.',
    });

    setIsNewLabModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Diagnostic Ultrasound & Laboratory Services
          </h1>
          <p className="text-xs text-slate-500">
            Dedicated digital sonography imaging suite and biomedical clinical laboratory for The Royal Agape Medical Centre.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSection === 'ultrasound' ? (
            <button
              onClick={() => setIsNewUltrasoundModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Ultrasound Scan</span>
            </button>
          ) : (
            <button
              onClick={() => setIsNewLabModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Order Lab Investigation</span>
            </button>
          )}
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSection('ultrasound')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeSection === 'ultrasound'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Scan className="w-4 h-4 text-teal-400" />
          <span>Ultrasound Scan Service ({ultrasounds.length})</span>
        </button>

        <button
          onClick={() => setActiveSection('lab')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
            activeSection === 'lab'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-amber-400" />
          <span>Biomedical Laboratory ({labs.length})</span>
        </button>
      </div>

      {/* SECTION 1: ULTRASOUND SUITE */}
      {activeSection === 'ultrasound' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ultrasounds.map((us) => (
              <div
                key={us.id}
                className="bg-white border border-slate-200 rounded-xl p-5 space-y-3.5 shadow-2xs hover:border-teal-300 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      {us.reportNumber}
                    </span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{us.status}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{us.patientName}</h3>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {us.patientHospitalNumber} · {us.patientAge} yrs · Date: {us.examDate}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1.5 border border-slate-150">
                    <div className="font-bold text-teal-900 flex items-center gap-1">
                      <Scan className="w-3.5 h-3.5 text-teal-600" />
                      <span>{us.examType}</span>
                    </div>
                    <div className="text-slate-600">
                      <strong>Indication: </strong>{us.clinicalIndication}
                    </div>
                    <div className="text-slate-800 font-medium">
                      <strong>Impression: </strong>{us.impression}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono tabular-nums">
                    Fee: NLe {us.feeNle}
                  </span>
                  <button
                    onClick={() => setSelectedUltrasoundForView(us)}
                    className="px-3 py-1.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Sonogram Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: BIOMEDICAL LABORATORY */}
      {activeSection === 'lab' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="py-3 px-4">Order #</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Investigation Test</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Result Summary</th>
                    <th className="py-3 px-4 text-right">Fee (NLe)</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {labs.map((lab) => (
                    <tr key={lab.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                        {lab.orderNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{lab.patientName}</div>
                        <div className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {lab.patientHospitalNumber}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {lab.testName}
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {lab.category}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-semibold ${
                            lab.status === 'Completed'
                              ? 'text-emerald-700'
                              : lab.status === 'Analyzing'
                              ? 'text-indigo-700'
                              : 'text-amber-700'
                          }`}
                        >
                          {lab.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-700">
                        {lab.results && lab.results.length > 0 ? (
                          <div className="space-y-0.5">
                            {lab.results.map((r, i) => (
                              <div key={i} className={r.isAbnormal ? 'text-rose-600 font-bold' : ''}>
                                {r.parameter}: {r.value} {r.unit}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Awaiting specimen</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        NLe {lab.feeNle}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {lab.status !== 'Completed' ? (
                          <button
                            onClick={() =>
                              updateLabStatus(lab.id, 'Completed', [
                                { parameter: 'Diagnostic Result', value: 'Analyzed & Verified', referenceRange: 'Normal', unit: '', isAbnormal: false },
                              ])
                            }
                            className="px-2.5 py-1 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded cursor-pointer"
                          >
                            Mark Complete
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px]">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sonogram Report Viewer / Printable Modal */}
      {selectedUltrasoundForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col">
            <div className="no-print p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="text-xs font-semibold">
                Official Ultrasound Sonography Examination Report
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report</span>
                </button>
                <button
                  onClick={() => setSelectedUltrasoundForView(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6 text-slate-900 overflow-y-auto max-h-[85vh] print-container">
              {/* Header */}
              <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
                <div className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  {HOSPITAL_METADATA.name}
                </div>
                <div className="text-xs font-bold text-teal-800 tracking-wider uppercase">
                  Department of Diagnostic Ultrasound & Medical Sonography
                </div>
                <p className="text-xs text-slate-600">
                  {HOSPITAL_METADATA.address} · Tel: {HOSPITAL_METADATA.phone1}
                </p>
              </div>

              {/* Patient Meta */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="font-bold text-sm text-slate-900">{selectedUltrasoundForView.patientName}</div>
                  <div className="font-mono text-slate-600">ID: {selectedUltrasoundForView.patientHospitalNumber}</div>
                  <div className="text-slate-600">Age: {selectedUltrasoundForView.patientAge} Years</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900">{selectedUltrasoundForView.reportNumber}</div>
                  <div className="text-slate-600">Date: {selectedUltrasoundForView.examDate}</div>
                  <div className="text-slate-600">Sonologist: {selectedUltrasoundForView.sonologist}</div>
                </div>
              </div>

              {/* Findings */}
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Examination Type & Indication:
                  </div>
                  <div className="text-slate-800 font-medium">{selectedUltrasoundForView.examType}</div>
                  <div className="text-slate-600">{selectedUltrasoundForView.clinicalIndication}</div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-150 space-y-2">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Sonographic Observations & Measurements:
                  </div>
                  {selectedUltrasoundForView.findings.gestationalAgeWeeks && (
                    <div className="grid grid-cols-2 gap-2 font-mono tabular-nums">
                      <div>Gestational Age: <strong>{selectedUltrasoundForView.findings.gestationalAgeWeeks} Weeks</strong></div>
                      <div>Fetal Heart Rate: <strong>{selectedUltrasoundForView.findings.fetalHeartRateBpm} bpm</strong></div>
                      <div>Placenta: <strong>{selectedUltrasoundForView.findings.placentaLocation}</strong></div>
                      <div>Amniotic Fluid (AFI): <strong>{selectedUltrasoundForView.findings.amnioticFluidIndex}</strong></div>
                    </div>
                  )}
                  {selectedUltrasoundForView.findings.organDetails && (
                    <div className="text-slate-700 pt-1">
                      {selectedUltrasoundForView.findings.organDetails}
                    </div>
                  )}
                </div>

                <div>
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Clinical Impression:
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-950 font-medium">
                    {selectedUltrasoundForView.impression}
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Recommendations:
                  </div>
                  <div className="text-slate-700">{selectedUltrasoundForView.recommendations}</div>
                </div>
              </div>

              {/* Signature Box */}
              <div className="pt-6 border-t border-slate-200 flex justify-between items-end text-xs">
                <div>
                  <div className="text-slate-500 font-mono text-[11px]">Status: Verified / Completed</div>
                  <div className="text-slate-500 font-mono text-[11px]">Fee: NLe {selectedUltrasoundForView.feeNle}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{selectedUltrasoundForView.sonologist}</div>
                  <div className="text-slate-500 text-[11px]">Lead Consultant Diagnostic Radiologist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Ultrasound Scan Request Modal */}
      {isNewUltrasoundModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">New Diagnostic Ultrasound Record</h3>
              </div>
              <button
                onClick={() => setIsNewUltrasoundModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUltrasound} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Patient *</label>
                <select
                  value={usPatientId}
                  onChange={(e) => setUsPatientId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.hospitalNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Scan Type</label>
                  <select
                    value={usExamType}
                    onChange={(e) => setUsExamType(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded text-slate-900"
                  >
                    <option value="Obstetric Ultrasound (ANC)">Obstetric (ANC Maternal)</option>
                    <option value="Pelvic Ultrasound">Pelvic Ultrasound</option>
                    <option value="Abdominal Ultrasound">Abdominal Ultrasound</option>
                    <option value="Renal & Bladder">Renal & Bladder</option>
                    <option value="Soft Tissue / Doppler">Soft Tissue / Doppler</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Fee (NLe)</label>
                  <input
                    type="number"
                    value={usFee}
                    onChange={(e) => setUsFee(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Clinical Indication *</label>
                <input
                  type="text"
                  value={usIndication}
                  onChange={(e) => setUsIndication(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Sonographic Impression *</label>
                <textarea
                  rows={2}
                  value={usImpression}
                  onChange={(e) => setUsImpression(e.target.value)}
                  placeholder="e.g. Single live fetus at 24 weeks, active cardiac activity, adequate liquor..."
                  required
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewUltrasoundModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Save Sonogram & Add to Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Lab Investigation Modal */}
      {isNewLabModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Order Laboratory Investigation</h3>
              </div>
              <button
                onClick={() => setIsNewLabModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLab} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Patient *</label>
                <select
                  value={labPatientId}
                  onChange={(e) => setLabPatientId(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.hospitalNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Test Category</label>
                  <select
                    value={labCategory}
                    onChange={(e) => setLabCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-200 rounded text-slate-900"
                  >
                    <option value="Parasitology & Rapid Tests">Parasitology (Malaria)</option>
                    <option value="Haematology">Haematology (FBC/PCV)</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Urinalysis">Urinalysis</option>
                    <option value="Serology">Serology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Test Fee (NLe)</label>
                  <input
                    type="number"
                    value={labFee}
                    onChange={(e) => setLabFee(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Specific Test Name *</label>
                <input
                  type="text"
                  value={labTestName}
                  onChange={(e) => setLabTestName(e.target.value)}
                  required
                  className="w-full p-2 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewLabModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded shadow-xs cursor-pointer"
                >
                  Submit Order & Auto-Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
