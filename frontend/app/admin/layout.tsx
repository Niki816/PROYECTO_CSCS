'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getToken } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.push('/admin/login');
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) return <div className="text-center py-10">Cargando...</div>;

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex gap-2 mb-6 border-b pb-3">
        <Link href="/admin/cursos" className="px-4 py-2 rounded bg-cscs-600 text-white text-sm">
          Cursos
        </Link>
        <Link
          href="/admin/certificados"
          className="px-4 py-2 rounded bg-cscs-600 text-white text-sm"
        >
          Certificados
        </Link>
      </div>
      {children}
    </div>
  );
}