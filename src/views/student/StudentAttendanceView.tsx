import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  LogIn,
  LogOut,
  Calendar,
  FileText,
  UserCheck,
} from 'lucide-react';

export const StudentAttendanceView: React.FC = () => {
  const { currentUser, attendance, recordAttendance, getStudentStats } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus>('hadir');
  const [note, setNote] = useState('');
  const [checkInTime, setCheckInTime] = useState('08:00');
  const [checkOutTime, setCheckOutTime] = useState('17:00');

  if (!currentUser) return null;

  const stats = getStudentStats(currentUser.id);
  const today = new Date().toISOString().slice(0, 10);
  const studentAttendance = attendance.filter((a) => a.studentId === currentUser.id);
  const todayRecord = studentAttendance.find((a) => a.date === today);

  const handleOpenAttendanceModal = (defaultStatus: AttendanceStatus = 'hadir') => {
    setSelectedStatus(defaultStatus);
    setNote(todayRecord?.note || '');
    setCheckInTime(todayRecord?.checkInTime || '08:00');
    setCheckOutTime(todayRecord?.checkOutTime || '17:00');
    setModalOpen(true);
  };

  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    recordAttendance(
      selectedStatus,
      note,
      selectedStatus === 'hadir' ? checkInTime : undefined,
      selectedStatus === 'hadir' && checkOutTime ? checkOutTime : undefined
    );
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Presensi & Kehadiran Magang
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Rekap catatan jam masuk, jam pulang, dan status izin siswa selama periode PKL
          </p>
        </div>

        <button
          onClick={() => handleOpenAttendanceModal('hadir')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <CalendarCheck className="w-4 h-4 text-slate-950" />
          <span>{todayRecord ? 'Ubah Presensi Hari Ini' : 'Isi Presensi Hari Ini'}</span>
        </button>
      </div>

      {/* Today Attendance Banner Card */}
      <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 border border-amber-300 flex items-center justify-center text-slate-950 shrink-0">
              <Clock className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Presensi Hari Ini: {today}
                </h3>
                {todayRecord && <StatusBadge type="attendance" status={todayRecord.status} />}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {todayRecord ? (
                  <>
                    {todayRecord.status === 'hadir' ? (
                      <span>
                        Jam Masuk:{' '}
                        <strong className="text-slate-900 font-mono">
                          {todayRecord.checkInTime || '-'}
                        </strong>{' '}
                        · Jam Pulang:{' '}
                        <strong className="text-slate-900 font-mono">
                          {todayRecord.checkOutTime || 'Belum Check-out'}
                        </strong>
                      </span>
                    ) : (
                      <span>Keterangan: {todayRecord.note || 'Tidak ada catatan'}</span>
                    )}
                  </>
                ) : (
                  'Anda belum melakukan presensi hari ini. Silakan catat kehadiran Anda.'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!todayRecord ? (
              <>
                <button
                  onClick={() => handleOpenAttendanceModal('hadir')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Check In Hadir</span>
                </button>
                <button
                  onClick={() => handleOpenAttendanceModal('izin')}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Ajukan Izin / Sakit</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => handleOpenAttendanceModal(todayRecord.status)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <span>Perbarui Data Presensi</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 5 Attendance Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Persentase */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-medium text-slate-500 block">Persentase Kehadiran</span>
          <p className="text-xl font-bold font-mono text-indigo-600 mt-1">
            {stats.attendancePercent}%
          </p>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Target minimal: 85%</span>
        </div>

        {/* Hadir */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Total Hadir</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {stats.totalHadir}
            <span className="text-xs font-normal text-slate-400 ml-1 font-sans">Hari</span>
          </p>
        </div>

        {/* Izin */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Izin</span>
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <p className="text-xl font-bold font-mono text-blue-700 mt-1">
            {stats.totalIzin}
            <span className="text-xs font-normal text-slate-400 ml-1 font-sans">Hari</span>
          </p>
        </div>

        {/* Sakit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Sakit</span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            {stats.totalSakit}
            <span className="text-xs font-normal text-slate-400 ml-1 font-sans">Hari</span>
          </p>
        </div>

        {/* Alpa */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Alpa / Tanpa Ket.</span>
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <p className="text-xl font-bold font-mono text-rose-700 mt-1">
            {stats.totalAlpa}
            <span className="text-xs font-normal text-slate-400 ml-1 font-sans">Hari</span>
          </p>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Presensi Magang</h3>
            <p className="text-xs text-slate-500">Daftar kehadiran harian yang telah tercatat</p>
          </div>
          <span className="text-xs font-mono font-medium text-slate-500">
            Total {studentAttendance.length} Catatan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 font-semibold">
              <tr>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 font-mono">Jam Masuk</th>
                <th className="px-5 py-3 font-mono">Jam Pulang</th>
                <th className="px-5 py-3">Keterangan / Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {studentAttendance.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400">
                    Belum ada data presensi yang tercatat.
                  </td>
                </tr>
              ) : (
                studentAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <StatusBadge type="attendance" status={rec.status} />
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {rec.checkInTime || '-'}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-600 whitespace-nowrap">
                      {rec.checkOutTime || '-'}
                    </td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">
                      {rec.note || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Presensi */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Formulir Presensi Kehadiran"
        subtitle={`Tanggal: ${today}`}
        maxWidth="md"
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Pilih Status Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['hadir', 'izin', 'sakit'] as AttendanceStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setSelectedStatus(st)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedStatus === st
                      ? 'border-amber-400 bg-amber-100 text-amber-950 font-bold shadow-2xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {selectedStatus === 'hadir' ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Masuk</label>
                <input
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Jam Pulang</label>
                <input
                  type="time"
                  value={checkOutTime}
                  onChange={(e) => setCheckOutTime(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Alasan / Keterangan {selectedStatus === 'izin' ? 'Izin' : 'Sakit'}{' '}
                <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan keterangan detail atau nama dokter..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>
          )}

          {selectedStatus === 'hadir' && (
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Datang lebih awal untuk persiapan server"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
            >
              Simpan Presensi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
