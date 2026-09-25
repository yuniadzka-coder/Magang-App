import React from 'react';
import { JournalStatus, AttendanceStatus, TargetStatus, AnnouncementPriority } from '../types';

interface StatusBadgeProps {
  type: 'journal' | 'attendance' | 'target' | 'priority';
  status: JournalStatus | AttendanceStatus | TargetStatus | AnnouncementPriority;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, status }) => {
  if (type === 'journal') {
    switch (status as JournalStatus) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Disetujui
          </span>
        );
      case 'menunggu_review':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Menunggu Review
          </span>
        );
      case 'perlu_revisi':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Perlu Revisi
          </span>
        );
      case 'draft':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Draft
          </span>
        );
    }
  }

  if (type === 'attendance') {
    switch (status as AttendanceStatus) {
      case 'hadir':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Hadir
          </span>
        );
      case 'izin':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Izin
          </span>
        );
      case 'sakit':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Sakit
          </span>
        );
      case 'alpa':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Alpa
          </span>
        );
    }
  }

  if (type === 'target') {
    switch (status as TargetStatus) {
      case 'selesai':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Selesai
          </span>
        );
      case 'sedang_dikerjakan':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Sedang Dikerjakan
          </span>
        );
      case 'belum_dimulai':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            Belum Dimulai
          </span>
        );
    }
  }

  if (type === 'priority') {
    switch (status as AnnouncementPriority) {
      case 'mendesak':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            Mendesak
          </span>
        );
      case 'penting':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Penting
          </span>
        );
      case 'info':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            Informasi
          </span>
        );
    }
  }

  return null;
};
