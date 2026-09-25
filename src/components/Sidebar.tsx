import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Target,
  Image,
  Bell,
  User,
  Users,
  X,
  Building2,
  CheckCircle,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
}) => {
  const { currentUser, journals, targets, announcements, getPlaceForStudent } = useApp();

  const isTeacher = currentUser?.role === 'guru';

  // Badge counts
  const pendingJournalsCount = journals.filter((j) => j.status === 'menunggu_review').length;
  const studentPendingDrafts = journals.filter(
    (j) => j.studentId === currentUser?.id && j.status === 'draft'
  ).length;

  const studentPlace = !isTeacher && currentUser ? getPlaceForStudent(currentUser) : undefined;

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'jurnal',
      label: 'Jurnal Kegiatan',
      icon: BookOpen,
      badge: studentPendingDrafts > 0 ? `${studentPendingDrafts} Draft` : undefined,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    { id: 'kehadiran', label: 'Kehadiran', icon: CalendarCheck },
    { id: 'target', label: 'Target Magang', icon: Target },
    { id: 'dokumentasi', label: 'Dokumentasi', icon: Image },
    {
      id: 'pengumuman',
      label: 'Pengumuman',
      icon: Bell,
      badge: announcements.length > 0 ? `${announcements.length}` : undefined,
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    { id: 'profil', label: 'Profil Saya', icon: User },
  ];

  const teacherNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'siswa', label: 'Daftar Siswa', icon: Users },
    {
      id: 'jurnal',
      label: 'Review Jurnal',
      icon: BookOpen,
      badge: pendingJournalsCount > 0 ? `${pendingJournalsCount} Perlu Review` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 font-semibold',
    },
    { id: 'kehadiran', label: 'Rekap Presensi', icon: CalendarCheck },
    { id: 'target', label: 'Kelola Target', icon: Target },
    { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
    { id: 'profil', label: 'Profil Guru', icon: User },
  ];

  const navItems = isTeacher ? teacherNav : studentNav;

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand & Mobile close */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Aplikasi Magang SMA
          </span>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Magang App</h2>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          aria-label="Tutup navigasi"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Context Card */}
      <div className="px-5 py-4 border-b border-slate-100 bg-amber-50/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
            {currentUser?.name.charAt(0) || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-slate-900 truncate">{currentUser?.name}</h4>
            <p className="text-xs text-slate-500 truncate">
              {isTeacher ? currentUser?.department : currentUser?.studentClass}
            </p>
          </div>
        </div>

        {!isTeacher && studentPlace && (
          <div className="mt-3 pt-3 border-t border-amber-200/50 flex items-center gap-2 text-xs text-slate-600">
            <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate font-medium">{studentPlace.name}</span>
          </div>
        )}
      </div>

      {/* Navigation Menu Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-amber-50/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-amber-600/30 text-slate-950' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Info */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="rounded-xl bg-white p-3 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-800">Status Magang</span>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Berjalan
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {currentUser?.school || 'SMA Negeri 1 Maju Bersama'}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30 pt-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full bg-white shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
