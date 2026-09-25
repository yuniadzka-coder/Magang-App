export type UserRole = 'siswa' | 'guru';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  school: string;
  // Siswa specific
  studentClass?: string;
  nisn?: string;
  internshipPlaceId?: string;
  mentorId?: string;
  // Guru specific
  nip?: string;
  department?: string;
  phone?: string;
}

export interface InternshipPlace {
  id: string;
  name: string;
  sector: string;
  address: string;
  companyMentorName: string;
  companyMentorPhone: string;
  companyMentorEmail: string;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string;   // YYYY-MM-DD
  totalDays: number;
}

export type JournalStatus = 'draft' | 'menunggu_review' | 'disetujui' | 'perlu_revisi';

export interface JournalEntry {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutTime: string; // HH:mm
  title: string;
  description: string;
  learned: string;
  challenges: string;
  photoUrl?: string;
  status: JournalStatus;
  feedbackTeacher?: string;
  feedbackDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'hadir' | 'izin' | 'sakit' | 'alpa';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  note?: string;
}

export type TargetStatus = 'belum_dimulai' | 'sedang_dikerjakan' | 'selesai';

export interface Target {
  id: string;
  studentId: string; // student id or 'all'
  studentName?: string;
  title: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  status: TargetStatus;
  progress: number; // 0 - 100
  createdByTeacherId: string;
  teacherName: string;
  studentNote?: string;
}

export interface DocumentationItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  photoUrl: string;
  tags?: string[];
}

export type AnnouncementPriority = 'info' | 'penting' | 'mendesak';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  priority: AnnouncementPriority;
  teacherId: string;
  teacherName: string;
  teacherRole: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
