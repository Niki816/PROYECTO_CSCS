'use client';
import { API_URL } from '@/lib/api';

interface Certificado {
  codigo: string;
  curso: string;
  notaFinal: number;
  fechaEmision: string;
}

interface Props {
  data: { estudiante: { nombreCompleto: string }; certificados: Certificado[] } | null;
}

const formatearFecha = (valor: string) => {
  const fecha = new Date(valor);
  if (isNaN(fecha.getTime())) return '—';
  return new Intl.DateTimeFormat('es-BO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(fecha);
};

const obtenerIniciales = (nombre: string) =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');

const IconoDescarga = () => (
  <svg
    className="h-4 w-4"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M10 3v9m0 0-3.5-3.5M10 12l3.5-3.5M4 15.5h12" />
  </svg>
);

const IconoVacio = () => (
  <svg
    className="h-10 w-10 text-gray-300"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 3h8l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
    <path d="M15 3v4h4M9 13h6M9 17h4" />
  </svg>
);

export default function TablaCertificados({ data }: Props) {
  if (!data) return null;

  const { estudiante, certificados } = data;

  const descargarPDF = (codigo: string) => {
    window.open(`${API_URL}/api/certificados/${codigo}/pdf`, '_blank', 'noopener,noreferrer');
  };

  const BotonDescarga = ({ codigo, curso }: { codigo: string; curso: string }) => (
    <button
      type="button"
      onClick={() => descargarPDF(codigo)}
      aria-label={`Descargar certificado de ${curso}`}
      className="inline-flex items-center gap-2 rounded-md bg-cscs-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cscs-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-cscs-600 focus-visible:ring-offset-2"
    >
      <IconoDescarga />
      Descargar PDF
    </button>
  );

  return (
    <section
      aria-labelledby="titulo-certificados"
      className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Encabezado: participante */}
      <header className="flex items-center gap-4 border-b border-gray-200 bg-cscs-50 px-6 py-5">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cscs-700 text-base font-semibold text-white"
          aria-hidden="true"
        >
          {obtenerIniciales(estudiante.nombreCompleto)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-600">Participante</p>
          <p className="truncate text-lg font-semibold text-cscs-800">
            {estudiante.nombreCompleto}
          </p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-2xl font-semibold leading-none text-cscs-800">
            {certificados.length}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {certificados.length === 1 ? 'certificado' : 'certificados'}
          </p>
        </div>
      </header>

      <div className="px-6 py-5">
        <h2 id="titulo-certificados" className="text-base font-semibold text-gray-900">
          Cursos en los que participó
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Descargue el certificado en PDF de cada curso concluido.
        </p>
      </div>

      {certificados.length === 0 ? (
        <div className="flex flex-col items-center gap-3 border-t border-gray-100 px-6 py-14 text-center">
          <IconoVacio />
          <p className="font-medium text-gray-800">No hay certificados emitidos</p>
          <p className="max-w-sm text-sm text-gray-500">
            Este participante aún no tiene certificados registrados. Verifique los datos
            ingresados o comuníquese con la institución.
          </p>
        </div>
      ) : (
        <>
          {/* Vista de escritorio: tabla */}
          <div className="hidden overflow-x-auto border-t border-gray-100 md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">
                Certificados de {estudiante.nombreCompleto}
              </caption>
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th scope="col" className="px-6 py-3 font-semibold">Curso</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Fecha de emisión</th>
                  <th scope="col" className="px-4 py-3 text-center font-semibold">Nota final</th>
                  <th scope="col" className="px-6 py-3 text-right font-semibold">Certificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {certificados.map((c) => (
                  <tr key={c.codigo} className="transition-colors hover:bg-cscs-50/50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{c.curso}</p>
                      <p className="mt-0.5 text-xs text-gray-500">Código: {c.codigo}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-gray-700">
                      {formatearFecha(c.fechaEmision)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-block min-w-[3rem] rounded-md bg-cscs-50 px-2.5 py-1 font-semibold tabular-nums text-cscs-800 ring-1 ring-inset ring-cscs-600/20">
                        {c.notaFinal}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <BotonDescarga codigo={c.codigo} curso={c.curso} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil: tarjetas */}
          <ul className="divide-y divide-gray-100 border-t border-gray-100 md:hidden">
            {certificados.map((c) => (
              <li key={c.codigo} className="space-y-3 px-6 py-5">
                <div>
                  <p className="font-medium text-gray-900">{c.curso}</p>
                  <p className="mt-0.5 text-xs text-gray-500">Código: {c.codigo}</p>
                </div>
                <dl className="flex gap-8 text-sm">
                  <div>
                    <dt className="text-gray-500">Emisión</dt>
                    <dd className="text-gray-800">{formatearFecha(c.fechaEmision)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Nota final</dt>
                    <dd className="font-semibold tabular-nums text-cscs-800">{c.notaFinal}</dd>
                  </div>
                </dl>
                <BotonDescarga codigo={c.codigo} curso={c.curso} />
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}