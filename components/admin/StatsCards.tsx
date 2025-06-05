'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface StatCard {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
  href: string;
}

interface StatsCardsProps {
  stats: StatCard[];
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-500',
    text: 'text-blue-600',
    lightBg: 'bg-blue-50',
  },
  green: {
    bg: 'bg-green-500',
    text: 'text-green-600',
    lightBg: 'bg-green-50',
  },
  purple: {
    bg: 'bg-purple-500',
    text: 'text-purple-600',
    lightBg: 'bg-purple-50',
  },
  orange: {
    bg: 'bg-orange-500',
    text: 'text-orange-600',
    lightBg: 'bg-orange-50',
  },
};

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const colors = colorClasses[stat.color];
        
        return (
          <Link
            key={stat.title}
            href={stat.href}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow hover:shadow-md transition-shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md ${colors.bg} p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.title}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            </dd>
          </Link>
        );
      })}
    </div>
  );
}
