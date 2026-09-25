import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ToastContainer } from './components/ToastContainer';
import { LoginView } from './views/LoginView';

// Student Views
import { StudentDashboardView } from './views/student/StudentDashboardView';
import { StudentJournalView } from './views/student/StudentJournalView';
import { StudentAttendanceView } from './views/student/StudentAttendanceView';
import { StudentTargetsView } from './views/student/StudentTargetsView';
import { StudentDocumentationView } from './views/student/StudentDocumentationView';
import { StudentAnnouncementsView } from './views/student/StudentAnnouncementsView';
import { StudentProfileView } from './views/student/StudentProfileView';

// Teacher Views
import { TeacherDashboardView } from './views/teacher/TeacherDashboardView';
import { TeacherStudentsView } from './views/teacher/TeacherStudentsView';
import { TeacherStudentDetailView } from './views/teacher/TeacherStudentDetailView';
import { TeacherJournalsReviewView } from './views/teacher/TeacherJournalsReviewView';
import { TeacherAttendanceView } from './views/teacher/TeacherAttendanceView';
import { TeacherTargetsView } from './views/teacher/TeacherTargetsView';
import { TeacherAnnouncementsView } from './views/teacher/TeacherAnnouncementsView';
import { TeacherProfileView } from './views/teacher/TeacherProfileView';

import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Target,
  Users,
  Menu,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // If no user is logged in, show Login view
  if (!currentUser) {
    return (
      <>
        <LoginView />
        <ToastContainer />
      </>
    );
  }

  const isTeacher = currentUser.role === 'guru';

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab('siswa');
  };

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'siswa') {
      setSelectedStudentId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <Navbar
        onToggleMobileMenu={() => setMobileSidebarOpen(true)}
        activeTab={activeTab}
      />

      <div className="flex-1 flex w-full">
        {/* Responsive Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 pt-6 pb-24 lg:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {isTeacher ? (
            // TEACHER ROUTING
            <>
              {activeTab === 'dashboard' && (
                <TeacherDashboardView
                  onSelectStudent={handleSelectStudent}
                  onNavigate={handleSelectTab}
                />
              )}
              {activeTab === 'siswa' &&
                (selectedStudentId ? (
                  <TeacherStudentDetailView
                    studentId={selectedStudentId}
                    onBack={() => setSelectedStudentId(null)}
                  />
                ) : (
                  <TeacherStudentsView onSelectStudent={handleSelectStudent} />
                ))}
              {activeTab === 'jurnal' && <TeacherJournalsReviewView />}
              {activeTab === 'kehadiran' && <TeacherAttendanceView />}
              {activeTab === 'target' && <TeacherTargetsView />}
              {activeTab === 'pengumuman' && <TeacherAnnouncementsView />}
              {activeTab === 'profil' && <TeacherProfileView />}
            </>
          ) : (
            // STUDENT ROUTING
            <>
              {activeTab === 'dashboard' && (
                <StudentDashboardView onNavigate={handleSelectTab} />
              )}
              {activeTab === 'jurnal' && <StudentJournalView />}
              {activeTab === 'kehadiran' && <StudentAttendanceView />}
              {activeTab === 'target' && <StudentTargetsView />}
              {activeTab === 'dokumentasi' && <StudentDocumentationView />}
              {activeTab === 'pengumuman' && <StudentAnnouncementsView />}
              {activeTab === 'profil' && <StudentProfileView />}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar for rapid thumb access */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Beranda</span>
        </button>

        {isTeacher ? (
          <button
            onClick={() => handleSelectTab('siswa')}
            className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'siswa' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>Siswa</span>
          </button>
        ) : null}

        <button
          onClick={() => handleSelectTab('jurnal')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'jurnal' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Jurnal</span>
        </button>

        <button
          onClick={() => handleSelectTab('kehadiran')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'kehadiran' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <CalendarCheck className="w-5 h-5 mb-0.5" />
          <span>Presensi</span>
        </button>

        <button
          onClick={() => handleSelectTab('target')}
          className={`flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium transition-colors ${
            activeTab === 'target' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Target className="w-5 h-5 mb-0.5" />
          <span>Target</span>
        </button>

        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex flex-col items-center p-1.5 rounded-lg text-[10px] font-medium text-slate-500 hover:text-slate-900"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Lainnya</span>
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
