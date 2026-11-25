'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getToken, clearToken } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [logueado, setLogueado] = useState(false);

  useEffect(() => {
    setLogueado(!!getToken());
  }, []);

  const logout = () => {
    clearToken();
    setLogueado(false);
    router.push('/');
  };

  return (
    <nav className="bg-cscs-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-wide">
          🎓 CSCS
        </Link>
        <div className="flex gap-5 text-sm items-center">
          <Link href="/" className="hover:underline">Cursos</Link>
          <Link href="/certificados" className="hover:underline">Certificados</Link>
          {logueado ? (
            <>
              <Link href="/admin/cursos" className="hover:underline">Admin</Link>
              <button onClick={logout} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs">
                Salir
              </button>
            </>
          ) : (
            <Link href="/admin/login" className="bg-white text-cscs-800 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}