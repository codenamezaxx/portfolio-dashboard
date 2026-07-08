/**
 * Profile Settings Component
 * 
 * Provides quick access to profile management options with modern UI.
 * - Change password
 * - Security settings
 * - Session management
 * - Resume/CV upload
 * - Logout
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLogout } from '@/lib/useLogout';
import { useToast } from '@/hooks/useToast';
import Swal from 'sweetalert2';
import { Modal } from '@/components/ui';
import { 
  KeyRound, 
  FileText, 
  ShieldCheck, 
  History, 
  LogOut, 
  ChevronRight,
  Info
} from 'lucide-react';
import type { AdminUser } from '@/types';

interface ProfileSettingsProps {
  user: AdminUser;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const router = useRouter();
  const toast = useToast();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [resumeLanguage, setResumeLanguage] = useState<'id' | 'en'>('id');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const { logout, isLoading: isLoggingOut, error: logoutError } = useLogout();

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.warning('Semua field password wajib diisi');
      await Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Semua field password wajib diisi',
        confirmButtonColor: '#B8860B',
      });
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.warning('Password baru minimal 8 karakter');
      await Swal.fire({
        icon: 'warning',
        title: 'Terlalu Pendek',
        text: 'Password baru minimal 8 karakter',
        confirmButtonColor: '#B8860B',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Konfirmasi password tidak sesuai');
      await Swal.fire({
        icon: 'error',
        title: 'Tidak Cocok',
        text: 'Konfirmasi password tidak sesuai',
        confirmButtonColor: '#B8860B',
      });
      return;
    }

    const result = await Swal.fire({
      icon: 'question',
      title: 'Ubah Password?',
      text: 'Anda akan diminta login kembali setelah password diubah.',
      showCancelButton: true,
      confirmButtonColor: '#B8860B',
      cancelButtonColor: '#8B7355',
      confirmButtonText: 'Ya, Ubah',
      cancelButtonText: 'Batal',
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password berhasil diubah');
        await Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Password berhasil diubah. Silakan login kembali.',
          confirmButtonColor: '#B8860B',
        });
        logout();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Gagal mengubah password');
      }
    } catch (error: any) {
      toast.error(error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
        confirmButtonColor: '#B8860B',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) return;

    setIsUploadingResume(true);
    Swal.fire({
      title: 'Uploading...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      formData.append('folder', 'resumes');
      formData.append('locale', resumeLanguage);

      const uploadRes = await fetch('/api/upload/pdf', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload gagal');
      const { url: resumeUrl } = await uploadRes.json();

      const updateBody = resumeLanguage === 'en'
        ? { resume_url_en: resumeUrl }
        : { resume_url: resumeUrl };

      const updateRes = await fetch('/api/content/profile-resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateBody),
      });

      if (!updateRes.ok) throw new Error('Gagal update database');

      // Dispatch event with language info so CVPreviewSection knows which to refresh
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('cv-uploaded', { detail: { locale: resumeLanguage } }));
        // Also dispatch language-specific event for targeted refresh
        window.dispatchEvent(new CustomEvent(`cv-uploaded-${resumeLanguage}`));
      }

      const langLabel = resumeLanguage === 'en' ? 'English' : 'Indonesia';
      toast.success(`Resume (${langLabel}) berhasil diperbarui`);
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Resume (${langLabel}) berhasil diperbarui`,
        confirmButtonColor: '#B8860B',
      });
      setShowResumeUpload(false);
      setResumeFile(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.message,
        confirmButtonColor: '#B8860B',
      });
    } finally {
      setIsUploadingResume(false);
      Swal.close();
    }
  };

  const settingsItems = [
    {
      label: 'Upload CV (Indonesia)',
      icon: FileText,
      onClick: () => { setResumeLanguage('id'); setShowResumeUpload(true); },
      color: 'text-accent-blue',
      bg: 'bg-accent-blue/10',
    },
    {
      label: 'Upload CV (English)',
      icon: FileText,
      onClick: () => { setResumeLanguage('en'); setShowResumeUpload(true); },
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
    },
    {
      label: 'Change Password',
      icon: KeyRound,
      onClick: () => setShowChangePassword(true),
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-surface-card border border-line p-6">
        <h3 className="text-xs font-black text-mute uppercase tracking-[0.2em] mb-6 border-b border-line pb-2 flex items-center gap-2">
          Account Settings
        </h3>

        <div className="space-y-3">
          {settingsItems.map((item) => {
            const Content = (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 ${item.bg} ${item.color} border border-transparent`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-ink text-sm">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-mute" />
              </div>
            );
            return (
              <button key={item.label} onClick={item.onClick} className="w-full text-left p-2 hover:bg-surface-soft cursor-pointer">
                {Content}
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-line">
            <button
              onClick={() => {
                Swal.fire({
                  title: 'Konfirmasi Keluar',
                  text: 'Sesi admin Anda akan diakhiri.',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonColor: '#cd4239',
                  cancelButtonColor: '#8B7355',
                  confirmButtonText: 'Ya, Keluar',
                }).then((result) => {
                   if (result.isConfirmed) {
                    logout();
                   }
                });
              }}
              className="w-full p-4 bg-accent-red-soft/20 hover:bg-accent-red-soft/40 border border-accent-red/10 hover:border-accent-red/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-accent-red-soft text-accent-red">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-bold text-accent-red">{isLoggingOut ? 'Logging out...' : 'Logout Session'}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-accent-red" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 bg-primary/5 border border-primary/10 flex gap-4">
        <Info className="w-6 h-6 text-primary flex-shrink-0" />
        <p className="text-xs text-body leading-relaxed">
          <span className="font-black text-primary uppercase tracking-wider block mb-1">Security Tip</span>
          Jaga kerahasiaan password Anda dan ganti secara berkala untuk menjaga keamanan akun portofolio Anda.
        </p>
      </div>

      {/* Resumes Upload Modal */}
      <Modal isOpen={showResumeUpload} onClose={() => setShowResumeUpload(false)} title={`Update CV/Resume (${resumeLanguage === 'en' ? 'English' : 'Indonesia'})`}>
        <form onSubmit={handleResumeUpload} className="space-y-6">
          {/* Language toggle */}
          <div className="flex gap-2 p-1 bg-surface-soft border border-line">
            <button
              type="button"
              onClick={() => setResumeLanguage('id')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                resumeLanguage === 'id'
                  ? 'bg-primary text-white'
                  : 'text-mute hover:text-ink'
              }`}
            >
              Indonesia
            </button>
            <button
              type="button"
              onClick={() => setResumeLanguage('en')}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                resumeLanguage === 'en'
                  ? 'bg-primary text-white'
                  : 'text-mute hover:text-ink'
              }`}
            >
              English
            </button>
          </div>

          <div className="p-8 border-2 border-dashed border-line hover:border-primary group text-center cursor-pointer relative">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FileText className="w-12 h-12 text-mute mx-auto mb-4" />
            <p className="text-sm font-bold text-ink">{resumeFile ? resumeFile.name : 'Pilih file PDF Resume'}</p>
            <p className="text-xs text-mute mt-2">Maksimal ukuran file 5MB</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={!resumeFile} className="flex-1">Upload Resume</button>
            <button type="button" onClick={() => setShowResumeUpload(false)} className="flex-1">Batal</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showChangePassword} onClose={() => setShowChangePassword(false)} title="Ganti Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="block text-[10px] font-black text-mute uppercase tracking-widest mb-1.5 ml-1">
                {field.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-surface-soft border border-line focus:border-primary outline-none"
                placeholder={`Masukkan ${field.toLowerCase()}...`}
                value={(passwordForm as any)[field]}
                onChange={(e) => setPasswordForm({ ...passwordForm, [field]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <button type="submit" className="flex-1">Simpan Password</button>
            <button type="button" onClick={() => setShowChangePassword(false)} className="flex-1">Batal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
