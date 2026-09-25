import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/Modal';
import { DocumentationItem } from '../../types';
import {
  Image as ImageIcon,
  Plus,
  Calendar,
  Eye,
  Trash2,
  Upload,
  Tag,
} from 'lucide-react';

import imgWorkspace from '../../assets/images/magang_doc_workspace_1790318210334.jpg';
import imgMentoring from '../../assets/images/magang_doc_mentoring_1790318232385.jpg';
import imgPresentation from '../../assets/images/magang_doc_presentation_1790318248757.jpg';
import imgNetworking from '../../assets/images/magang_doc_networking_1790318262225.jpg';

export const StudentDocumentationView: React.FC = () => {
  const { currentUser, documentations, addDocumentation, deleteDocumentation } = useApp();

  const [selectedDoc, setSelectedDoc] = useState<DocumentationItem | null>(null);
  const [modalAddOpen, setModalAddOpen] = useState(false);

  // Form states
  const todayStr = new Date().toISOString().slice(0, 10);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(todayStr);
  const [photoUrl, setPhotoUrl] = useState(imgWorkspace);
  const [tagInput, setTagInput] = useState('Magang, Aktivitas');

  if (!currentUser) return null;

  // Student's documentation or shared
  const studentDocs = documentations.filter(
    (d) => d.studentId === currentUser.id || d.studentId === 'siswa-1'
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addDocumentation({
      studentId: currentUser.id,
      studentName: currentUser.name,
      title,
      description,
      date,
      photoUrl,
      tags,
    });

    // Reset
    setTitle('');
    setDescription('');
    setDate(todayStr);
    setPhotoUrl(imgWorkspace);
    setTagInput('Magang, Aktivitas');
    setModalAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Galeri Dokumentasi Kegiatan
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kumpulan bukti visual, foto lingkungan kerja, dan dokumentasi aktivitas magang
          </p>
        </div>

        <button
          onClick={() => setModalAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Tambah Dokumentasi Foto</span>
        </button>
      </div>

      {/* Gallery Grid */}
      {studentDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-sm font-bold text-slate-800">Belum ada foto dokumentasi</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Unggah foto meja kerja, mentoring, atau presentasi untuk melengkapi portofolio magang Anda.
          </p>
          <button
            onClick={() => setModalAddOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Foto Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {studentDocs.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col"
            >
              {/* Image Container with hover overlay */}
              <div
                className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                onClick={() => setSelectedDoc(item)}
              >
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-white text-xs font-medium flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Klik untuk perbesar
                  </span>
                </div>
              </div>

              {/* Card Meta & Description */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {item.date}
                    </span>
                    {item.studentId === currentUser.id && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Hapus foto dokumentasi ini?')) {
                            deleteDocumentation(item.id);
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h3
                    onClick={() => setSelectedDoc(item)}
                    className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View Full Image / Lightbox */}
      <Modal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc?.title || 'Dokumentasi Kegiatan'}
        subtitle={`Tanggal: ${selectedDoc?.date} · Siswa: ${selectedDoc?.studentName}`}
        maxWidth="2xl"
      >
        {selectedDoc && (
          <div className="space-y-4 text-xs">
            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-950">
              <img
                src={selectedDoc.photoUrl}
                alt={selectedDoc.title}
                className="w-full max-h-[480px] object-contain mx-auto"
              />
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">{selectedDoc.title}</h4>
              <p className="text-slate-600 text-xs leading-relaxed whitespace-pre-line">
                {selectedDoc.description}
              </p>

              {selectedDoc.tags && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedDoc.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Tambah Dokumentasi */}
      <Modal
        isOpen={modalAddOpen}
        onClose={() => setModalAddOpen(false)}
        title="Unggah Foto Dokumentasi Baru"
        subtitle="Dokumentasikan aktivitas magang untuk bahan laporan akhir"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveDoc} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Tanggal Kegiatan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kategori / Tags (pisahkan koma)
              </label>
              <input
                type="text"
                placeholder="Workspace, Frontend, Review"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Judul Foto / Kegiatan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Sesi Mentoring Teknis Kode Bersama Mentor Industri"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Deskripsi Singkat Aktivitas
            </label>
            <textarea
              rows={3}
              placeholder="Tuliskan keterangan mengenai apa yang sedang dilakukan pada foto ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Photo source */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Pilih Foto</label>
            <div className="flex items-center gap-3 mb-2">
              <label className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-700">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Unggah File dari Komputer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { url: imgWorkspace, label: 'Workspace' },
                { url: imgMentoring, label: 'Mentoring' },
                { url: imgPresentation, label: 'Presentasi' },
                { url: imgNetworking, label: 'Jaringan' },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(p.url)}
                  className={`relative rounded-xl overflow-hidden border-2 aspect-4/3 cursor-pointer ${
                    photoUrl === p.url
                      ? 'border-amber-400 ring-2 ring-amber-300'
                      : 'border-transparent opacity-80'
                  }`}
                >
                  <img src={p.url} alt={p.label} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] px-1 rounded">
                    {p.label}
                  </span>
                </button>
              ))}
            </div>

            {photoUrl && (
              <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-600 mb-1">Foto Terpilih:</p>
                <img
                  src={photoUrl}
                  alt="Selected"
                  className="h-28 object-cover rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalAddOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-400 text-slate-950 font-semibold rounded-xl hover:bg-amber-500 transition-colors shadow-xs cursor-pointer"
            >
              Simpan ke Galeri
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
