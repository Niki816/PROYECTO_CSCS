'use client';
import { useState } from 'react';
import FormBusqueda from '@/components/FormBusqueda';
import TablaCertificados from '@/components/TablaCertificados';

export default function Certificados() {
  const [resultado, setResultado] = useState<any>(null);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-cscs-800">Consulta de Certificados</h1>
        <p className="text-gray-600 mt-1">Ingrese sus datos para ver sus certificados</p>
      </div>
      <FormBusqueda onResultado={setResultado} />
      <TablaCertificados data={resultado} />
    </div>
  );
}