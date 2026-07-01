/**
 * Admin Sidebar Navigation Component
 * 
 * Provides navigation menu for admin panel with collapsible support.
 * Displays all content management sections.
 * Conforms to design system specifications with light and dark mode support.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLogout } from '@/lib/useLogout';
import { 
  Terminal, ArrowLeft, LogOut, 
  LayoutDashboard, User, Target, Rocket, 
  Settings, Briefcase, Trophy, Mail, 
  Users, FileText, Database, X
} from 'lucide-react';
import Swal from 'sweetalert2';

interface NavItem {
  label: string;
  href: string;
  icon: any; // Lucide icon component
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Overview and statistics',
  },
  {
    label: 'Profile',
    href: '/admin/profile',
    icon: User,
    description: 'View your profile',
  },
  {
    label: 'Hero Section',
    href: '/admin/hero',
    icon: Target,
    description: 'Edit profile information',
  },
  {
    label: 'Journey',
    href: '/admin/journey',
    icon: Rocket,
    description: 'Manage career timeline',
  },
  {
    label: 'Tech Stack',
    href: '/admin/tech-stack',
    icon: Settings,
    description: 'Manage technologies',
  },
  {
    label: 'Projects',
    href: '/admin/projects',
    icon: Briefcase,
    description: 'Manage portfolio projects',
  },
  {
    label: 'Achievements',
    href: '/admin/achievements',
    icon: Trophy,
    description: 'Manage certificates',
  },
  {
    label: 'Contact Info',
    href: '/admin/contact',
    icon: Mail,
    description: 'Manage social links',
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
    description: 'Manage admin users',
  },
  {
    label: 'Activity Log',
    href: '/admin/activity-log',
    icon: FileText,
    description: 'View audit logs',
  },
  {
    label: 'Backups',
    href: '/admin/backups',
    icon: Database,
    description: 'Manage backups',
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ 
  isCollapsed = false, 
  isMobileOpen = false, 
  onMobileClose 
}: SidebarProps) {
  const pathname = usePathname();
  const { logout, isLoading: isLoggingOut } = useLogout();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Konfirmasi Keluar',
      text: 'Sesi admin Anda akan diakhiri.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#cd4239',
      cancelButtonColor: '#8B7355',
      confirmButtonText: 'Ya, Keluar',
      cancelButtonText: 'Batal',
      background: 'var(--background)',
      color: 'var(--foreground)',
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-surface-card border-r border-line flex flex-col z-50 md:relative md:translate-x-0 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        {/* Logo / Branding */}
        <div className={`p-5 border-b border-line flex items-center justify-between gap-3 overflow-hidden ${isCollapsed ? 'px-4' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Terminal className="text-accent w-8 h-8" />
            </div>
            {!isCollapsed && (
              <div className="whitespace-nowrap">
                <p className="text-xl font-bold uppercase tracking-wider text-ink">Admin Panel</p>
                <p className="text-xs text-mute uppercase tracking-wider">Portfolio Manager</p>
              </div>
            )}
          </div>
          
          {/* Close button for mobile */}
          {isMobileOpen && (
            <button 
              onClick={onMobileClose}
              className="md:hidden p-1 hover:bg-surface-soft text-mute"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                title={isCollapsed ? item.label : ''}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                  ${active
                    ? 'bg-primary/10 text-accent border border-[var(--primary)]/20'
                    : 'text-body hover:bg-surface-soft hover:text-ink'
                  }
                  ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0`} />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons Section */}
        <div className={`border-t border-line p-4 space-y-2 ${isCollapsed ? 'items-center' : ''}`}>
          <Link
            href="/"
            title={isCollapsed ? "Kembali ke Portfolio" : ""}
            className={`flex items-center justify-center gap-2 w-full px-3 py-2 bg-surface-soft text-ink border border-line text-sm font-medium
              ${isCollapsed ? 'px-0' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> 
            {!isCollapsed && <span>Kembali</span>}
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title={isCollapsed ? "Logout" : ""}
            className={`w-full px-3 py-2 text-sm font-medium flex items-center justify-center gap-2 bg-red-950/30 text-red-400 border border-red-900/50 disabled:opacity-50
              ${isCollapsed ? 'px-0' : ''}`}
          >
            {!isCollapsed && (isLoggingOut ? '...' : 'Logout')}
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
