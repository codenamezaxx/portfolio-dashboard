/**
 * User Profile Card Component
 * 
 * Displays the current user's profile information with modern design.
 * Includes interactive profile picture (avatar) upload functionality.
 */

'use client';

import { useState, useRef } from 'react';
import { Camera, Mail, Shield, Clock, Calendar, Hash, CheckCircle2, XCircle } from 'lucide-react';
import type { AdminUser } from '@/types';
import Swal from 'sweetalert2';

interface UserProfileCardProps {
  user: AdminUser;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.avatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Frontend preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Validation
    if (!file.type.startsWith('image/')) {
      await Swal.fire({
        icon: 'error',
        title: 'Format Salah',
        text: 'Mohon upload file gambar (JPG, PNG, WEBP)',
        confirmButtonColor: '#B8860B',
      });
      setPreviewUrl(user.avatarUrl || null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      await Swal.fire({
        icon: 'error',
        title: 'File Terlalu Besar',
        text: 'Ukuran gambar maksimal 2MB',
        confirmButtonColor: '#B8860B',
      });
      setPreviewUrl(user.avatarUrl || null);
      return;
    }

    // Upload
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const uploadRes = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      const uploadData = await uploadRes.json();
      const newAvatarUrl = uploadData.url;

      // Update user profile in DB
      const updateRes = await fetch('/api/admin/profile/avatar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      if (!updateRes.ok) throw new Error('Failed to update profile');

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Foto profil berhasil diperbarui',
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh page to sync with top bar
      window.location.reload();
    } catch (error) {
      console.error('Avatar upload error:', error);
      setPreviewUrl(user.avatarUrl || null);
      await Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal memperbarui foto profil. Silakan coba lagi.',
        confirmButtonColor: '#B8860B',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-surface-card dark:bg-surface-card border border-hairline dark:border-hairline rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header / Banner */}
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent dark:from-primary/30 dark:via-primary/20 dark:to-transparent" />
      
      {/* Profile Info Overlay */}
      <div className="px-8 pb-8 -mt-16">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          {/* Avatar Container */}
          <div className="relative group">
            <div 
              onClick={handleAvatarClick}
              className={`w-32 h-32 rounded-2xl border-4 border-surface-card bg-surface-soft dark:bg-surface-soft shadow-xl overflow-hidden flex items-center justify-center cursor-pointer relative ${isUploading ? 'opacity-50' : ''}`}
            >
              {previewUrl && typeof previewUrl === 'string' && previewUrl.trim() !== '' ? (
                <img 
                  src={previewUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    setPreviewUrl(null);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary">
                  <span className="text-4xl font-black uppercase">
                    {user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-white w-8 h-8" />
              </div>

              {/* Uploading Spinner */}
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
            />
          </div>

          <div className="flex-1 pb-2">
            <h2 className="text-3xl font-black text-ink dark:text-ink leading-tight">
              {user.email.split('@')[0]}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm font-medium text-mute dark:text-mute flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${user.isActive ? 'bg-accent-green-soft text-accent-green' : 'bg-accent-red-soft text-accent-red'}`}>
                {user.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          {/* Account Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-mute dark:text-mute uppercase tracking-[0.2em] border-b border-hairline pb-2">
              Account Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-all">
                <div className="p-2.5 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline shadow-sm">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mute uppercase tracking-widest">Role</p>
                  <p className="text-sm font-bold text-ink dark:text-ink">System Administrator</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-all">
                <div className="p-2.5 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline shadow-sm">
                  <Hash className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mute uppercase tracking-widest">User ID</p>
                  <p className="text-[10px] font-mono font-bold text-ink dark:text-ink opacity-60 truncate max-w-[200px]">
                    {user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-6">
            <h3 className="text-xs font-black text-mute dark:text-mute uppercase tracking-[0.2em] border-b border-hairline pb-2">
              Activity History
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-blue-soft/20 border border-accent-blue/10 group hover:border-accent-blue/30 transition-all">
                <div className="p-2.5 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline shadow-sm">
                  <Clock className="w-5 h-5 text-accent-blue" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mute uppercase tracking-widest">Last Login</p>
                  <p className="text-sm font-bold text-ink dark:text-ink">{formatDate(user.lastLogin)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-purple-soft/20 border border-accent-purple/10 group hover:border-accent-purple/30 transition-all">
                <div className="p-2.5 rounded-lg bg-surface-card dark:bg-surface-card border border-hairline shadow-sm">
                  <Calendar className="w-5 h-5 text-accent-purple" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-mute uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-bold text-ink dark:text-ink">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
