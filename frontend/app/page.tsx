'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import CursoCard from '@/components/CursoCard';

export default function Home() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api('/api/cursos').then(setCursos).catch(() => setCursos([])).finally(() => setCargando(false));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-cscs-800">
          Centro Social de Capacitación Superior
        </h1>
        <p className="text-gray-600 mt-2">Cursos disponibles</p>
      </div>

      {cargando ? (
        <p className="text-center text-gray-500">Cargando cursos...</p>
      ) : cursos.length === 0 ? (
        <p className="text-center text-gray-500 py-10">No hay cursos disponibles por el momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cursos.map((c) => <CursoCard key={c.id} curso={c} />)}
        </div>
      )}
    </div>
  );
}