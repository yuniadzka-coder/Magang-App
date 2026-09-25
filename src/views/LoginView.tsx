import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  BookOpen,
  CalendarCheck,
  Building2,
  ArrowRight,
} from 'lucide-react';

export const LoginView: React.FC = () => {
  const { login } = useApp();
  const [role, setRole] = useState<UserRole>('siswa');
  const [email, setEmail] = useState('siswa@demo.com');
  const [password, setPassword] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Harap masukkan email.');
      return;
    }
    if (!password) {
      setErrorMsg('Harap masukkan kata sandi.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const ok = login(email, role);
      setLoading(false);
      if (!ok) {
        setErrorMsg('Email atau password tidak sesuai untuk peran yang dipilih.');
      }
    }, 400);
  };

  const handleQuickDemo = (demoRole: UserRole) => {
    if (demoRole === 'siswa') {
      setRole('siswa');
      setEmail('siswa@demo.com');
      setPassword('123456');
      login('siswa@demo.com', 'siswa');
    } else {
      setRole('guru');
      setEmail('guru@demo.com');
      setPassword('123456');
      login('guru@demo.com', 'guru');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Brand Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 shadow-lg shadow-amber-200/60 mb-4 font-bold">
          <GraduationCap className="w-8 h-8 text-slate-950" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Magang App
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
          Sistem Informasi & Manajemen Kegiatan Magang Siswa SMA / SMK
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
          {/* Role Selector Tabs */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Pilih Peran Masuk
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setRole('siswa');
                  setEmail('siswa@demo.com');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  role === 'siswa'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Siswa Magang
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('guru');
                  setEmail('guru@demo.com');
                }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                  role === 'guru'
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Guru Pembimbing
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Email / Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="nama@demo.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 shadow-md shadow-amber-200/60 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk ke Aplikasi</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500 mb-3 text-center">
              Akses Cepat Akun Demo (1-Klik)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('siswa')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                  Demo Siswa
                </span>
                <span className="text-[11px] text-slate-500">Raditya Pratama</span>
                <span className="text-[10px] text-amber-700 font-mono mt-1">siswa@demo.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('guru')}
                className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                  Demo Guru
                </span>
                <span className="text-[11px] text-slate-500">Ibu Sri Wahyuni</span>
                <span className="text-[10px] text-amber-700 font-mono mt-1">guru@demo.com</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Password default demo: <span className="font-mono text-slate-600">123456</span>
            </p>
          </div>
        </div>

        {/* Feature Highlights Card */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <BookOpen className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <p className="text-xs font-semibold text-slate-800">Jurnal Harian</p>
            <p className="text-[11px] text-slate-500">Catat & review</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <CalendarCheck className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <p className="text-xs font-semibold text-slate-800">Presensi</p>
            <p className="text-[11px] text-slate-500">Rekap kehadiran</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <Building2 className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <p className="text-xs font-semibold text-slate-800">Monitoring</p>
            <p className="text-[11px] text-slate-500">Guru & industri</p>
          </div>
        </div>
      </div>
    </div>
  );
};
