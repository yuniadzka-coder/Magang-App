import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  ChevronDown,
  RotateCcw,
  LogOut,
  UserCheck,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  activeTab: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu, activeTab }) => {
  const { currentUser, users, switchUser, logout, resetDemoData } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return 'Dashboard Utama';
      case 'jurnal':
        return currentUser?.role === 'guru' ? 'Pusat Review Jurnal' : 'Jurnal Harian Magang';
      case 'kehadiran':
        return currentUser?.role === 'guru' ? 'Rekap Kehadiran Siswa' : 'Presensi & Kehadiran';
      case 'target':
        return currentUser?.role === 'guru' ? 'Kelola Target & Tugas' : 'Target & Tugas Magang';
      case 'dokumentasi':
        return 'Galeri Dokumentasi';
      case 'pengumuman':
        return 'Papan Pengumuman';
      case 'siswa':
        return 'Daftar Siswa Bimbingan';
      case 'profil':
        return 'Profil Pengguna';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Zone 1 & Mobile Toggle: Brand single wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-900 font-bold shadow-xs">
            <GraduationCap className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Magang App
          </span>
        </div>

        <div className="hidden sm:flex items-center text-slate-300 ml-2 font-mono">/</div>
        <div className="hidden sm:block text-sm font-medium text-slate-600 truncate max-w-xs">
          {getPageTitle(activeTab)}
        </div>
      </div>

      {/* Zone 2: Academic year ticker */}
      <div className="hidden md:flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
        <span>Semester Ganjil 2026/2027</span>
      </div>

      {/* Zone 3: Quick Switcher & User Profile Menu */}
      <div className="flex items-center gap-3">
        {/* Switch User Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-amber-50/60 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors"
            title="Klik untuk beralih akun demo"
          >
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px]">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="text-left hidden sm:block max-w-[130px] truncate">
              <span className="font-semibold block truncate leading-tight">{currentUser?.name}</span>
              <span className="text-[10px] text-slate-400 capitalize block leading-tight">
                {currentUser?.role === 'guru' ? 'Guru Pembimbing' : 'Siswa Magang'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-40 animate-in fade-in-50 zoom-in-95">
                <div className="px-2 py-1.5 mb-1 border-b border-slate-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Beralih Akun Cepat (Demo)
                  </p>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 text-left rounded-lg text-xs transition-colors ${
                        user.id === currentUser?.id
                          ? 'bg-amber-100/70 text-amber-950 font-semibold'
                          : 'text-slate-700 hover:bg-amber-50/50'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {user.role === 'guru' ? 'Guru' : user.studentClass || 'Siswa'}
                        </p>
                      </div>
                      {user.id === currentUser?.id && (
                        <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      if (window.confirm('Reset semua data kembali ke kondisi demo awal?')) {
                        resetDemoData();
                        setDropdownOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reset Data Demo</span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
