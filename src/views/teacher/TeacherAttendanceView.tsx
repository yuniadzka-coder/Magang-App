import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/Modal';
import { AttendanceStatus } from '../../types';
import {
  CalendarCheck,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  User,
  AlertCircle,
} from 'lucide-react';

export const TeacherAttendanceView: React.FC = () => {
  const { users, attendance, recordStudentAttendanceManual } = useApp();

  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');

  // Modal manual input
  const [modalOpen, setModalOpen] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState(users.find((u) => u.role === 'siswa')?.id || '');
  const [inputDate, setInputDate] = useState(new Date().toISOString().slice(0, 10));
  const [inputStatus, setInputStatus] = useState<AttendanceStatus>('hadir');
  const [inputNote, setInputNote] = useState('');

  const students = users.filter((u) => u.role === 'siswa');

  const filteredAttendance = attendance.filter((a) => {
    const matchesStudent = selectedStudent === 'all' || a.studentId === selectedStudent;
    const matchesStatus = selectedStatus === 'all' || a.status === selectedStatus;
    const matchesDate = !filterDate || a.date === filterDate;
    return matchesStudent && matchesStatus && matchesDate;
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId) return;
    recordStudentAttendanceManual(targetStudentId, inputDate, inputStatus, inputNote);
    setModalOpen(false);
    setInputNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Rekap Presensi Kehadiran Siswa
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau kedisiplinan jam kehadiran dan catatan perizinan siswa di tempat magang
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Input Presensi Siswa</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Siswa */}
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">Semua Siswa Magang</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.studentClass})
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="hadir">Hadir</option>
            <option value="izin">Izin</option>
            <option value="sakit">Sakit</option>
            <option value="alpa">Alpa</option>
          </select>

          {/* Date */}
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:bg-white focus:outline-none"
          />

          {(selectedStudent !== 'all' || selectedStatus !== 'all' || filterDate) && (
            <button
              onClick={() => {
                setSelectedStudent('all');
                setSelectedStatus('all');
                setFilterDate('');
              }}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1"
            >
              Reset Filter
            </button>
          )}
        </div>

        <span className="text-xs font-mono text-slate-500 font-medium">
          Ditemukan {filteredAttendance.length} Catatan Presensi
        </span>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200/80 font-semibold">
              <tr>
                <th className="px-5 py-3.5">Tanggal</th>
                <th className="px-5 py-3.5">Nama Siswa</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 font-mono">Jam Masuk</th>
                <th className="px-5 py-3.5 font-mono">Jam Pulang</th>
                <th className="px-5 py-3.5">Catatan / Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                    Tidak ada catatan presensi yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {rec.date}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900 whitespace-nowrap">
                      {rec.studentName}
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge type="attendance" status={rec.status} />
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {rec.checkInTime || '-'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                      {rec.checkOutTime || '-'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 max-w-xs truncate">
                      {rec.note || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Input Presensi Siswa */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Input Presensi Siswa Bimbingan"
        maxWidth="md"
      >
        <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa</label>
            <select
              value={targetStudentId}
              onChange={(e) => setTargetStudentId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500"
              required
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} - {s.studentClass}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={inputDate}
                onChange={(e) => setInputDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Kehadiran</label>
              <select
                value={inputStatus}
                onChange={(e) => setInputStatus(e.target.value as AttendanceStatus)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-amber-500"
              >
                <option value="hadir">Hadir</option>
                <option value="izin">Izin</option>
                <option value="sakit">Sakit</option>
                <option value="alpa">Alpa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Catatan / Alasan
            </label>
            <input
              type="text"
              placeholder="Contoh: Izin tugas sekolah atau sakit demam"
              value={inputNote}
              onChange={(e) => setInputNote(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 shadow-xs cursor-pointer"
            >
              Simpan Presensi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
