'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Verificar({ params }: { params: { codigo: string } }) {
  const [estado, setEstado] = useState<'cargando' | 'valido' | 'invalido'>('cargando');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api(`/api/certificados/verificar/${params.codigo}`)
      .then((d) => { setData(d); setEstado('valido'); })
      .catch(() => setEstado('invalido'));
  }, [params.codigo]);

  return (
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-center text-cscs-800 mb-6">
        Verificación de Certificado
      </h1>

      {estado === 'cargando' && <p className="text-center text-gray-500">Verificando...</p>}

      {estado === 'invalido' && (
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-bold text-red-700">Certificado No Válido</h2>
          <p className="text-gray-600 mt-2">
            El código <code className="bg-gray-100 px-1 rounded">{params.codigo}</code> no
            corresponde a ningún certificado emitido por el CSCS.
          </p>
        </div>
      )}

      {estado === 'valido' && data && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-green-700">Certificado Válido</h2>
          </div>
          <dl className="space-y-2 text-sm">
            <Row label="Código" value={data.certificado.codigo} />
            <Row label="Participante" value={data.certificado.estudiante} />
            <Row label="C.I." value={data.certificado.ci} />
            <Row label="Curso" value={data.certificado.curso} />
            <Row label="Carga horaria" value={`${data.certificado.cargaHoraria} horas`} />
            <Row label="Modalidad" value={data.certificado.modalidad} />
            <Row label="Nota final" value={`${data.certificado.notaFinal}/100`} />
            <Row
              label="Fecha de emisión"
              value={new Date(data.certificado.fechaEmision).toLocaleDateString('es-BO')}
            />
          </dl>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-green-200 pb-1">
      <dt className="font-medium text-gray-700">{label}:</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}