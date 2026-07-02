/**
 * Statistics Widget Component
 * 
 * Displays a single statistic with icon, label, and value.
 * Enhanced with vibrant accent colors and premium design.
 */

'use client';

import { LucideIcon } from 'lucide-react';

interface StatisticsWidgetProps {
  label: string;
  value: number;
  icon: LucideIcon;
  isLoading?: boolean;
  color?: 'blue' | 'purple' | 'green' | 'red' | 'amber' | 'primary';
}

export function StatisticsWidget({
  label,
  value,
  icon: Icon,
  isLoading = false,
  color = 'primary',
}: StatisticsWidgetProps) {
  
  const colorMap = {
    blue: {
      bg: 'bg-accent-blue-soft/50',
      border: 'border-accent-blue/30',
      stripe: 'bg-accent-blue',
      text: 'text-accent-blue',
      icon: 'text-accent-blue',
    },
    purple: {
      bg: 'bg-accent-purple-soft/50',
      border: 'border-accent-purple/30',
      stripe: 'bg-accent-purple',
      text: 'text-accent-purple',
      icon: 'text-accent-purple',
    },
    green: {
      bg: 'bg-accent-green-soft/50',
      border: 'border-accent-green/30',
      stripe: 'bg-accent-green',
      text: 'text-accent-green',
      icon: 'text-accent-green',
    },
    red: {
      bg: 'bg-accent-red-soft/50',
      border: 'border-accent-red/30',
      stripe: 'bg-accent-red',
      text: 'text-accent-red',
      icon: 'text-accent-red',
    },
    amber: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      stripe: 'bg-primary',
      text: 'text-primary',
      icon: 'text-primary',
    },
    primary: {
      bg: 'bg-primary/10',
      border: 'border-primary/30',
      stripe: 'bg-primary',
      text: 'text-primary',
      icon: 'text-primary',
    }
  };

  const styles = colorMap[color] || colorMap.primary;

  return (
    <div className={`relative overflow-hidden p-6 ${styles.bg} border ${styles.border}`}>
      {/* Left Accent Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${styles.stripe}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs font-extrabold text-mute uppercase tracking-[0.15em] mb-4">{label}</p>
          {isLoading ? (
            <div className="h-10 w-24 bg-surface-soft/50" />
          ) : (
            <div className="flex items-baseline gap-1">
              <p className={`text-4xl lg:text-5xl font-black ${styles.text} leading-tight tabular-nums`}>
                {value}
              </p>
            </div>
          )}
        </div>
        
        <div className={`p-3 ${styles.bg} border ${styles.border}`}>
          <Icon className={`w-8 h-8 ${styles.icon} opacity-80`} />
        </div>
      </div>
      
      {/* Subtle Background Decorative Element */}
      <div className={`absolute -right-4 -bottom-4 opacity-[0.03]`}>
        <Icon className="w-24 h-24" />
      </div>
    </div>
  );
}
