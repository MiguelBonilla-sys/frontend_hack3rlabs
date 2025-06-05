'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { usePermissions } from '@/lib/permissions';
import PermissionGuard from './PermissionGuard';
import {
  HomeIcon, NewspaperIcon, CalendarDaysIcon, UserGroupIcon, FolderIcon,
  BriefcaseIcon, BookOpenIcon, ShieldCheckIcon, UsersIcon, UserCircleIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { PermissionModels } from '@/types/api';

const navigationItems: { name: string; href: string; icon: React.ElementType; model?: PermissionModels }[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Conferencias', href: '/admin/conferencias', icon: CalendarDaysIcon, model: 'conferencias' },
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpenIcon, model: 'cursos' },
  { name: 'Noticias', href: '/admin/noticias', icon: NewspaperIcon, model: 'noticias' },
  { name: 'Integrantes', href: '/admin/integrantes', icon: UserGroupIcon, model: 'integrantes' },
  { name: 'Proyectos', href: '/admin/proyectos', icon: FolderIcon, model: 'proyectos' },
  { name: 'Ofertas Empleo', href: '/admin/ofertas', icon: BriefcaseIcon, model: 'ofertas' },
  { name: 'Auditoría', href: '/admin/audit', icon: ShieldCheckIcon, model: 'auditlog' },
  { name: 'Usuarios', href: '/admin/users', icon: UsersIcon, model: 'users' },
  { name: 'Grupos', href: '/admin/groups', icon: UserCircleIcon, model: 'groups' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { isStaff } = usePermissions();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isStaff()) {
    return null;
  }

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-bold text-white">H4ck3r L4bs</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  const linkContent = (
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  );

                  if (item.model) {
                    return (
                      <PermissionGuard key={item.name} model={item.model} action="view">
                        <li>{linkContent}</li>
                      </PermissionGuard>
                    );
                  }
                  
                  return <li key={item.name}>{linkContent}</li>;
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
