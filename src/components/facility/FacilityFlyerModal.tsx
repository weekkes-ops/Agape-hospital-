/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * The Royal Agape Medical Centre - Official Facility Profile & Flyer Viewer
 */

import React from 'react';
import { useHospital } from '../../context/HospitalContext';
import {
  X,
  PhoneCall,
  Mail,
  Globe,
  MapPin,
  CheckCircle2,
  Stethoscope,
  Heart,
  Baby,
  ShieldAlert,
} from 'lucide-react';
import { HOSPITAL_METADATA } from '../../data/mockData';

export const FacilityFlyerModal: React.FC = () => {
  const { isFlyerModalOpen, setIsFlyerModalOpen } = useHospital();

  if (!isFlyerModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm">
              ✚
            </div>
            <div>
              <h2 className="text-base font-bold">The Royal Agape Medical Centre</h2>
              <p className="text-xs text-slate-400">Official Facility Accreditation & Hospital Profile</p>
            </div>
          </div>
          <button
            onClick={() => setIsFlyerModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: 2 Columns on desktop */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left Column: The Attached Official Flyer Image */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Official Hospital Announcement & Banner
            </div>
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex items-center justify-center">
              <img
                src={HOSPITAL_METADATA.flyerPath}
                alt="The Royal Agape Medical Centre Official Banner - Kogbo 2, Ogoo Farm, Freetown"
                className="w-full h-auto object-contain max-h-[580px]"
                loading="eager"
              />
            </div>
            <div className="text-[11px] text-slate-500 text-center italic">
              Original promotional & clinical service brochure for The Royal Agape Medical Centre.
            </div>
          </div>

          {/* Right Column: Key Details, Contact & Clinical Departments */}
          <div className="space-y-5 text-xs">
            {/* Core Contact Card */}
            <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2.5">
              <div className="font-bold text-sm text-teal-950 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Compassionate Agape Care & 24/7 Clinical Excellence</span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                Dedicated to elevating healthcare delivery across Freetown, the Western Area Peninsular, and Sierra Leone with modern digital ultrasonography, maternal antenatal care, and trauma management.
              </p>

              <div className="pt-2 border-t border-teal-200/80 space-y-2">
                <div className="flex items-start gap-2 text-slate-800">
                  <MapPin className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <span><strong>Address: </strong>{HOSPITAL_METADATA.address}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-800 font-mono tabular-nums">
                  <PhoneCall className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    <strong>Telephone: </strong>
                    <a href={`tel:${HOSPITAL_METADATA.phone1}`} className="text-teal-800 underline mr-2">
                      {HOSPITAL_METADATA.phone1}
                    </a>
                    /
                    <a href={`tel:${HOSPITAL_METADATA.phone2}`} className="text-teal-800 underline ml-2">
                      {HOSPITAL_METADATA.phone2}
                    </a>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-800">
                  <Mail className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    <strong>Email: </strong>
                    <a href={`mailto:${HOSPITAL_METADATA.email}`} className="text-teal-800 underline">
                      {HOSPITAL_METADATA.email}
                    </a>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-800">
                  <Globe className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    <strong>Website: </strong>
                    <a
                      href={`https://${HOSPITAL_METADATA.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-800 underline"
                    >
                      {HOSPITAL_METADATA.website}
                    </a>
                  </span>
                </div>
              </div>
            </div>

            {/* Leadership Profile */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">
                Executive Leadership
              </div>
              <div className="text-slate-800 font-semibold">
                {HOSPITAL_METADATA.leadership.ceo}
              </div>
              <div className="text-slate-500 text-[11px]">
                {HOSPITAL_METADATA.leadership.title}
              </div>
              <p className="text-slate-600 pt-1 text-[11px] leading-relaxed">
                Featured on the facility announcement, leading a multidisciplinary team of physicians, sonologists, clinical officers, certified midwives, and biomedical laboratory scientists.
              </p>
            </div>

            {/* Our Clinical Services */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                Active Hospital Services
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>24/7 Emergency & Trauma Care</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Out Patient Services (OPD)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Maternal (ANC) & Child Health</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Internal Medicine Consultation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Laboratory Testing Services</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Ultrasound Scan Service</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Licensed Hospital Pharmacy</span>
                </div>
              </div>
            </div>

            {/* Upcoming Services */}
            <div className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1.5">
              <div className="font-bold text-indigo-950 text-xs uppercase tracking-wide">
                Upcoming Expanded Services:
              </div>
              <div className="flex flex-wrap gap-2 text-indigo-900 font-medium">
                <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">Surgical Services</span>
                <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">In-Patient Services & Wards</span>
                <span className="bg-white px-2 py-0.5 rounded border border-indigo-200">Postnatal Care Units</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
