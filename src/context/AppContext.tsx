import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  InternshipPlace,
  JournalEntry,
  AttendanceRecord,
  AttendanceStatus,
  Target,
  DocumentationItem,
  Announcement,
  ToastMessage,
} from '../types';
import {
  MOCK_USERS,
  MOCK_INTERNSHIP_PLACES,
  MOCK_JOURNALS,
  MOCK_ATTENDANCE,
  MOCK_TARGETS,
  MOCK_DOCUMENTATION,
  MOCK_ANNOUNCEMENTS,
} from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
} from 'firebase/firestore';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  places: InternshipPlace[];
  journals: JournalEntry[];
  attendance: AttendanceRecord[];
  targets: Target[];
  documentations: DocumentationItem[];
  announcements: Announcement[];
  toasts: ToastMessage[];
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updatePlace: (placeId: string, updates: Partial<InternshipPlace>) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
  removeToast: (id: string) => void;
  addJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournal: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournal: (id: string) => void;
  submitJournalDraft: (id: string) => void;
  reviewJournal: (id: string, status: 'disetujui' | 'perlu_revisi', feedback: string) => void;
  recordAttendance: (status: AttendanceStatus, note?: string, checkIn?: string, checkOut?: string) => void;
  recordStudentAttendanceManual: (studentId: string, date: string, status: AttendanceStatus, note?: string) => void;
  addTarget: (target: Omit<Target, 'id' | 'createdByTeacherId' | 'teacherName'>) => void;
  updateTarget: (id: string, updates: Partial<Target>) => void;
  deleteTarget: (id: string) => void;
  addDocumentation: (item: Omit<DocumentationItem, 'id'>) => void;
  deleteDocumentation: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'teacherId' | 'teacherName' | 'teacherRole'>) => void;
  deleteAnnouncement: (id: string) => void;
  resetDemoData: () => void;
  getPlaceForStudent: (student: User) => InternshipPlace | undefined;
  getStudentStats: (studentId: string) => {
    totalDays: number;
    daysCompleted: number;
    attendancePercent: number;
    totalHadir: number;
    totalIzin: number;
    totalSakit: number;
    totalAlpa: number;
    totalJournals: number;
    approvedJournals: number;
    pendingJournals: number;
    revisionJournals: number;
    totalTargets: number;
    completedTargets: number;
    inProgressTargets: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'magang_app_current_user_v1',
  USERS: 'magang_app_users_v1',
  PLACES: 'magang_app_places_v1',
  JOURNALS: 'magang_app_journals_v1',
  ATTENDANCE: 'magang_app_attendance_v1',
  TARGETS: 'magang_app_targets_v1',
  DOCS: 'magang_app_docs_v1',
  ANNOUNCEMENTS: 'magang_app_announcements_v1',
};

// Firestore background synchronization helpers
const syncDocToFirestore = async (col: string, id: string, data: any) => {
  try {
    await setDoc(doc(db, col, id), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${col}/${id}`);
  }
};

const removeDocFromFirestore = async (col: string, id: string) => {
  try {
    await deleteDoc(doc(db, col, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${col}/${id}`);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default logged in user is Demo Siswa (Raditya Pratama)
    return MOCK_USERS[0];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [places, setPlaces] = useState<InternshipPlace[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLACES);
    return saved ? JSON.parse(saved) : MOCK_INTERNSHIP_PLACES;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
    return saved ? JSON.parse(saved) : MOCK_JOURNALS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : MOCK_ATTENDANCE;
  });

  const [targets, setTargets] = useState<Target[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return saved ? JSON.parse(saved) : MOCK_TARGETS;
  });

  const [documentations, setDocumentations] = useState<DocumentationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    return saved ? JSON.parse(saved) : MOCK_DOCUMENTATION;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : MOCK_ANNOUNCEMENTS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLACES, JSON.stringify(places));
  }, [places]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documentations));
  }, [documentations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  // Firestore Realtime Listeners & Auto-Seeding
  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteUsers = snapshot.docs.map((d) => d.data() as User);
          setUsers(remoteUsers);
        } else {
          // Seed users to Firestore
          MOCK_USERS.forEach((u) => syncDocToFirestore('users', u.id, u));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'users')
    );

    const unsubPlaces = onSnapshot(
      collection(db, 'places'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remotePlaces = snapshot.docs.map((d) => d.data() as InternshipPlace);
          setPlaces(remotePlaces);
        } else {
          MOCK_INTERNSHIP_PLACES.forEach((p) => syncDocToFirestore('places', p.id, p));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'places')
    );

    const unsubJournals = onSnapshot(
      collection(db, 'journals'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteJournals = snapshot.docs.map((d) => d.data() as JournalEntry);
          setJournals(remoteJournals);
        } else {
          MOCK_JOURNALS.forEach((j) => syncDocToFirestore('journals', j.id, j));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'journals')
    );

    const unsubAttendance = onSnapshot(
      collection(db, 'attendance'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteAtt = snapshot.docs.map((d) => d.data() as AttendanceRecord);
          setAttendance(remoteAtt);
        } else {
          MOCK_ATTENDANCE.forEach((a) => syncDocToFirestore('attendance', a.id, a));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'attendance')
    );

    const unsubTargets = onSnapshot(
      collection(db, 'targets'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteTargets = snapshot.docs.map((d) => d.data() as Target);
          setTargets(remoteTargets);
        } else {
          MOCK_TARGETS.forEach((t) => syncDocToFirestore('targets', t.id, t));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'targets')
    );

    const unsubDocs = onSnapshot(
      collection(db, 'documentations'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteDocs = snapshot.docs.map((d) => d.data() as DocumentationItem);
          setDocumentations(remoteDocs);
        } else {
          MOCK_DOCUMENTATION.forEach((docItem) => syncDocToFirestore('documentations', docItem.id, docItem));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'documentations')
    );

    const unsubAnnouncements = onSnapshot(
      collection(db, 'announcements'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteAnc = snapshot.docs.map((d) => d.data() as Announcement);
          setAnnouncements(remoteAnc);
        } else {
          MOCK_ANNOUNCEMENTS.forEach((anc) => syncDocToFirestore('announcements', anc.id, anc));
        }
      },
      (error) => handleFirestoreError(error, OperationType.GET, 'announcements')
    );

    return () => {
      unsubUsers();
      unsubPlaces();
      unsubJournals();
      unsubAttendance();
      unsubTargets();
      unsubDocs();
      unsubAnnouncements();
    };
  }, []);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = (email: string, role: UserRole): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === role
    );

    if (found) {
      setCurrentUser(found);
      showToast('success', 'Berhasil Masuk', `Selamat datang kembali, ${found.name}!`);
      return true;
    }

    // Fallback demo matching
    if (cleanEmail === 'siswa@demo.com' && role === 'siswa') {
      const demoSiswa = users.find((u) => u.role === 'siswa') || MOCK_USERS[0];
      setCurrentUser(demoSiswa);
      showToast('success', 'Berhasil Masuk', `Selamat datang kembali, ${demoSiswa.name}!`);
      return true;
    }

    if (cleanEmail === 'guru@demo.com' && role === 'guru') {
      const demoGuru = users.find((u) => u.role === 'guru') || MOCK_USERS[5];
      setCurrentUser(demoGuru);
      showToast('success', 'Berhasil Masuk', `Selamat datang kembali, ${demoGuru.name}!`);
      return true;
    }

    showToast('error', 'Login Gagal', 'Email atau role tidak cocok. Silakan coba kembali.');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('info', 'Keluar Akun', 'Anda telah keluar dari aplikasi.');
  };

  const switchUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast('info', 'Beralih Akun', `Beralih ke akun ${user.name} (${user.role.toUpperCase()})`);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    let updatedUser: User | null = null;
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          updatedUser = { ...u, ...updates };
          return updatedUser;
        }
        return u;
      })
    );

    if (updatedUser) {
      syncDocToFirestore('users', userId, updatedUser);
    }

    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    }

    // Also sync studentName in journals and attendance if name changed
    if (updates.name) {
      setJournals((prev) =>
        prev.map((j) => (j.studentId === userId ? { ...j, studentName: updates.name! } : j))
      );
      setAttendance((prev) =>
        prev.map((a) => (a.studentId === userId ? { ...a, studentName: updates.name! } : a))
      );
      setTargets((prev) =>
        prev.map((t) => (t.studentId === userId ? { ...t, studentName: updates.name! } : t))
      );
    }
    if (updates.studentClass) {
      setJournals((prev) =>
        prev.map((j) => (j.studentId === userId ? { ...j, studentClass: updates.studentClass! } : j))
      );
    }
    showToast('success', 'Data Disimpan', 'Informasi profil berhasil diperbarui.');
  };

  const updatePlace = (placeId: string, updates: Partial<InternshipPlace>) => {
    let updatedPlace: InternshipPlace | null = null;
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          updatedPlace = { ...p, ...updates };
          return updatedPlace;
        }
        return p;
      })
    );

    if (updatedPlace) {
      syncDocToFirestore('places', placeId, updatedPlace);
    }

    showToast('success', 'Data Tempat Disimpan', 'Informasi tempat magang berhasil diperbarui.');
  };

  const addJournal = (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    const newEntry: JournalEntry = {
      ...entry,
      id: 'jrn-' + Date.now(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    setJournals((prev) => [newEntry, ...prev]);
    syncDocToFirestore('journals', newEntry.id, newEntry);

    // Also auto-add documentation if photo is included
    if (newEntry.photoUrl && newEntry.photoUrl.trim() !== '') {
      const newDoc: DocumentationItem = {
        id: 'doc-' + Date.now(),
        studentId: newEntry.studentId,
        studentName: newEntry.studentName,
        title: newEntry.title,
        description: newEntry.description.slice(0, 150) + (newEntry.description.length > 150 ? '...' : ''),
        date: newEntry.date,
        photoUrl: newEntry.photoUrl,
        tags: ['Jurnal', 'Magang'],
      };
      setDocumentations((prev) => [newDoc, ...prev]);
      syncDocToFirestore('documentations', newDoc.id, newDoc);
    }

    showToast(
      'success',
      entry.status === 'draft' ? 'Draft Disimpan' : 'Jurnal Terkirim',
      entry.status === 'draft'
        ? 'Jurnal disimpan sebagai draf dan dapat diedit kembali.'
        : 'Jurnal berhasil dikirim ke guru pembimbing untuk direview.'
    );
  };

  const updateJournal = (id: string, updates: Partial<JournalEntry>) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    let updatedJournal: JournalEntry | null = null;
    setJournals((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          updatedJournal = { ...j, ...updates, updatedAt: timestamp };
          return updatedJournal;
        }
        return j;
      })
    );

    if (updatedJournal) {
      syncDocToFirestore('journals', id, updatedJournal);
    }

    showToast('success', 'Jurnal Diperbarui', 'Perubahan jurnal berhasil disimpan.');
  };

  const deleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
    removeDocFromFirestore('journals', id);
    showToast('info', 'Jurnal Dihapus', 'Catatan jurnal telah dihapus.');
  };

  const submitJournalDraft = (id: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    let targetJournal: JournalEntry | null = null;
    setJournals((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          targetJournal = { ...j, status: 'menunggu_review', updatedAt: timestamp };
          return targetJournal;
        }
        return j;
      })
    );

    if (targetJournal) {
      syncDocToFirestore('journals', id, targetJournal);
    }

    showToast('success', 'Jurnal Dikirim', 'Draf berhasil dikirim ke guru pembimbing!');
  };

  const reviewJournal = (id: string, status: 'disetujui' | 'perlu_revisi', feedback: string) => {
    const now = new Date();
    const timestamp = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
    let reviewedJournal: JournalEntry | null = null;
    setJournals((prev) =>
      prev.map((j) => {
        if (j.id === id) {
          reviewedJournal = {
            ...j,
            status,
            feedbackTeacher: feedback.trim() !== '' ? feedback : undefined,
            feedbackDate: timestamp,
            updatedAt: timestamp,
          };
          return reviewedJournal;
        }
        return j;
      })
    );

    if (reviewedJournal) {
      syncDocToFirestore('journals', id, reviewedJournal);
    }

    showToast(
      'success',
      status === 'disetujui' ? 'Jurnal Disetujui' : 'Catatan Revisi Terkirim',
      status === 'disetujui'
        ? 'Jurnal siswa telah disetujui.'
        : 'Catatan permintaan revisi telah dikirim ke siswa.'
    );
  };

  const recordAttendance = (
    status: AttendanceStatus,
    note?: string,
    checkIn?: string,
    checkOut?: string
  ) => {
    if (!currentUser) return;
    const today = new Date().toISOString().slice(0, 10);
    const existingIndex = attendance.findIndex(
      (a) => a.studentId === currentUser.id && a.date === today
    );

    const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const inTime = checkIn || (status === 'hadir' ? nowTime : undefined);

    if (existingIndex >= 0) {
      // Update today's record (e.g. check-out)
      const existing = attendance[existingIndex];
      const updated: AttendanceRecord = {
        ...existing,
        status,
        checkInTime: inTime || existing.checkInTime,
        checkOutTime: checkOut || (existing.checkInTime && !existing.checkOutTime ? nowTime : existing.checkOutTime),
        note: note !== undefined ? note : existing.note,
      };
      const newAttendance = [...attendance];
      newAttendance[existingIndex] = updated;
      setAttendance(newAttendance);
      syncDocToFirestore('attendance', updated.id, updated);
      showToast('success', 'Presensi Diperbarui', `Presensi hari ini telah diperbarui: ${status.toUpperCase()}`);
    } else {
      // Create new record for today
      const newRecord: AttendanceRecord = {
        id: 'att-' + Date.now(),
        studentId: currentUser.id,
        studentName: currentUser.name,
        date: today,
        status,
        checkInTime: inTime,
        checkOutTime: checkOut,
        note: note || (status === 'hadir' ? 'Presensi mandiri via Magang App' : undefined),
      };
      setAttendance((prev) => [newRecord, ...prev]);
      syncDocToFirestore('attendance', newRecord.id, newRecord);
      showToast('success', 'Presensi Berhasil', `Status kehadiran hari ini: ${status.toUpperCase()}`);
    }
  };

  const recordStudentAttendanceManual = (
    studentId: string,
    date: string,
    status: AttendanceStatus,
    note?: string
  ) => {
    const student = users.find((u) => u.id === studentId);
    if (!student) return;

    const existingIndex = attendance.findIndex((a) => a.studentId === studentId && a.date === date);
    if (existingIndex >= 0) {
      const updated = {
        ...attendance[existingIndex],
        status,
        note: note || attendance[existingIndex].note,
      };
      const copy = [...attendance];
      copy[existingIndex] = updated;
      setAttendance(copy);
      syncDocToFirestore('attendance', updated.id, updated);
    } else {
      const newRecord: AttendanceRecord = {
        id: 'att-' + Date.now(),
        studentId,
        studentName: student.name,
        date,
        status,
        note: note || 'Dicatat oleh Guru Pembimbing',
      };
      setAttendance((prev) => [newRecord, ...prev]);
      syncDocToFirestore('attendance', newRecord.id, newRecord);
    }
    showToast('success', 'Presensi Siswa Disimpan', `Kehadiran ${student.name} tanggal ${date} diperbarui.`);
  };

  const addTarget = (target: Omit<Target, 'id' | 'createdByTeacherId' | 'teacherName'>) => {
    const teacher = currentUser?.role === 'guru' ? currentUser : users.find((u) => u.role === 'guru');
    const newTarget: Target = {
      ...target,
      id: 'tgt-' + Date.now(),
      createdByTeacherId: teacher?.id || 'guru-1',
      teacherName: teacher?.name || 'Ibu Sri Wahyuni, S.Pd',
    };
    setTargets((prev) => [newTarget, ...prev]);
    syncDocToFirestore('targets', newTarget.id, newTarget);
    showToast('success', 'Target Dibuat', `Target "${newTarget.title}" berhasil ditambahkan.`);
  };

  const updateTarget = (id: string, updates: Partial<Target>) => {
    let updatedTarget: Target | null = null;
    setTargets((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          // Auto update status if progress is 100
          if (updates.progress !== undefined) {
            if (updates.progress === 100) {
              updated.status = 'selesai';
            } else if (updates.progress > 0 && updated.status === 'belum_dimulai') {
              updated.status = 'sedang_dikerjakan';
            }
          }
          updatedTarget = updated;
          return updated;
        }
        return t;
      })
    );

    if (updatedTarget) {
      syncDocToFirestore('targets', id, updatedTarget);
    }

    showToast('success', 'Target Diperbarui', 'Progres target berhasil diperbarui.');
  };

  const deleteTarget = (id: string) => {
    setTargets((prev) => prev.filter((t) => t.id !== id));
    removeDocFromFirestore('targets', id);
    showToast('info', 'Target Dihapus', 'Target magang telah dihapus.');
  };

  const addDocumentation = (item: Omit<DocumentationItem, 'id'>) => {
    const newDoc: DocumentationItem = {
      ...item,
      id: 'doc-' + Date.now(),
    };
    setDocumentations((prev) => [newDoc, ...prev]);
    syncDocToFirestore('documentations', newDoc.id, newDoc);
    showToast('success', 'Dokumentasi Ditambahkan', 'Foto kegiatan berhasil diunggah ke galeri.');
  };

  const deleteDocumentation = (id: string) => {
    setDocumentations((prev) => prev.filter((d) => d.id !== id));
    removeDocFromFirestore('documentations', id);
    showToast('info', 'Dokumentasi Dihapus', 'Item dokumentasi telah dihapus.');
  };

  const addAnnouncement = (
    announcement: Omit<Announcement, 'id' | 'teacherId' | 'teacherName' | 'teacherRole'>
  ) => {
    const teacher = currentUser?.role === 'guru' ? currentUser : users.find((u) => u.role === 'guru');
    const newAnc: Announcement = {
      ...announcement,
      id: 'anc-' + Date.now(),
      teacherId: teacher?.id || 'guru-1',
      teacherName: teacher?.name || 'Ibu Sri Wahyuni, S.Pd',
      teacherRole: teacher?.department || 'Pembimbing Magang',
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    syncDocToFirestore('announcements', newAnc.id, newAnc);
    showToast('success', 'Pengumuman Diterbitkan', 'Pengumuman baru telah disiarkan ke siswa.');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    removeDocFromFirestore('announcements', id);
    showToast('info', 'Pengumuman Dihapus', 'Pengumuman telah dihapus.');
  };

  const resetDemoData = () => {
    localStorage.clear();
    setUsers(MOCK_USERS);
    setCurrentUser(MOCK_USERS[0]);
    setJournals(MOCK_JOURNALS);
    setAttendance(MOCK_ATTENDANCE);
    setTargets(MOCK_TARGETS);
    setDocumentations(MOCK_DOCUMENTATION);
    setAnnouncements(MOCK_ANNOUNCEMENTS);

    // Sync seed back to Firestore
    MOCK_USERS.forEach((u) => syncDocToFirestore('users', u.id, u));
    MOCK_INTERNSHIP_PLACES.forEach((p) => syncDocToFirestore('places', p.id, p));
    MOCK_JOURNALS.forEach((j) => syncDocToFirestore('journals', j.id, j));
    MOCK_ATTENDANCE.forEach((a) => syncDocToFirestore('attendance', a.id, a));
    MOCK_TARGETS.forEach((t) => syncDocToFirestore('targets', t.id, t));
    MOCK_DOCUMENTATION.forEach((d) => syncDocToFirestore('documentations', d.id, d));
    MOCK_ANNOUNCEMENTS.forEach((anc) => syncDocToFirestore('announcements', anc.id, anc));

    showToast('success', 'Data Direset', 'Semua data demo berhasil dikembalikan ke kondisi awal.');
  };

  const getPlaceForStudent = (student: User): InternshipPlace | undefined => {
    return places.find((p) => p.id === student.internshipPlaceId);
  };

  const getStudentStats = (studentId: string) => {
    const student = users.find((u) => u.id === studentId);
    const place = student ? getPlaceForStudent(student) : undefined;
    const totalDays = place ? place.totalDays : 90;

    const studentAttendance = attendance.filter((a) => a.studentId === studentId);
    const totalHadir = studentAttendance.filter((a) => a.status === 'hadir').length;
    const totalIzin = studentAttendance.filter((a) => a.status === 'izin').length;
    const totalSakit = studentAttendance.filter((a) => a.status === 'sakit').length;
    const totalAlpa = studentAttendance.filter((a) => a.status === 'alpa').length;

    const recordedDays = studentAttendance.length;
    const attendancePercent = recordedDays > 0 ? Math.round((totalHadir / recordedDays) * 100) : 100;

    const studentJournals = journals.filter((j) => j.studentId === studentId);
    const totalJournals = studentJournals.length;
    const approvedJournals = studentJournals.filter((j) => j.status === 'disetujui').length;
    const pendingJournals = studentJournals.filter((j) => j.status === 'menunggu_review').length;
    const revisionJournals = studentJournals.filter((j) => j.status === 'perlu_revisi').length;

    const studentTargets = targets.filter((t) => t.studentId === studentId || t.studentId === 'all');
    const totalTargets = studentTargets.length;
    const completedTargets = studentTargets.filter((t) => t.status === 'selesai').length;
    const inProgressTargets = studentTargets.filter((t) => t.status === 'sedang_dikerjakan').length;

    // Approximate days completed in internship period (from Aug 1 to end of Sep = ~40 work days)
    const daysCompleted = Math.min(totalHadir + totalIzin + totalSakit + 20, totalDays);

    return {
      totalDays,
      daysCompleted,
      attendancePercent,
      totalHadir,
      totalIzin,
      totalSakit,
      totalAlpa,
      totalJournals,
      approvedJournals,
      pendingJournals,
      revisionJournals,
      totalTargets,
      completedTargets,
      inProgressTargets,
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        places,
        journals,
        attendance,
        targets,
        documentations,
        announcements,
        toasts,
        login,
        logout,
        switchUser,
        updateUser,
        updatePlace,
        showToast,
        removeToast,
        addJournal,
        updateJournal,
        deleteJournal,
        submitJournalDraft,
        reviewJournal,
        recordAttendance,
        recordStudentAttendanceManual,
        addTarget,
        updateTarget,
        deleteTarget,
        addDocumentation,
        deleteDocumentation,
        addAnnouncement,
        deleteAnnouncement,
        resetDemoData,
        getPlaceForStudent,
        getStudentStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
