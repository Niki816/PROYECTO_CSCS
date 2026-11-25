import Image from 'next/image';

interface Curso {
  id: string;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  fechaInicio: string;
  fechaFin: string;
  cargaHoraria: number;
  modalidad: string;
}

export default function CursoCard({ curso }: { curso: Curso }) {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('es-BO', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <div className="h-44 bg-gray-100 relative">
        {curso.imagenUrl ? (
          <Image src={curso.imagenUrl} alt={curso.nombre} fill className="object-cover" sizes="400px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">Sin imagen</div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-cscs-800 text-lg leading-tight">{curso.nombre}</h3>
        {curso.descripcion && (
          <p className="text-sm text-gray-600 line-clamp-2">{curso.descripcion}</p>
        )}
        <div className="text-xs text-gray-500 mt-auto pt-2 space-y-1">
          <p>📅 {fmt(curso.fechaInicio)} → {fmt(curso.fechaFin)}</p>
          <p>⏱ {curso.cargaHoraria} horas · 🎯 {curso.modalidad}</p>
        </div>
      </div>
    </div>
  );
}