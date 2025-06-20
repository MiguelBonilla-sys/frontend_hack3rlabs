'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Newspaper, 
  Briefcase, 
  Users, 
  Calendar,
  Building2,
  LogOut 
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Cursos', href: '/admin/cursos', icon: BookOpen },
  { name: 'Noticias', href: '/admin/noticias', icon: Newspaper },
  { name: 'Proyectos', href: '/admin/proyectos', icon: Briefcase },
  { name: 'Integrantes', href: '/admin/integrantes', icon: Users },
  { name: 'Ofertas', href: '/admin/ofertas', icon: Building2 },
  { name: 'Conferencias', href: '/admin/conferencias', icon: Calendar },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

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
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/admin' && pathname.startsWith(item.href));
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
            <li className="mt-auto">
              <div className="text-xs leading-6 font-semibold text-gray-400 mb-4">
                Usuario: {user?.username}
              </div>
              <button
                onClick={handleLogout}
                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:bg-gray-800 hover:text-white"
              >
                <LogOut className="h-6 w-6 shrink-0" aria-hidden="true" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
