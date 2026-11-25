'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

const EXPEDIDOS = ['LP', 'CB', 'SC', 'OR', 'PT', 'TJ', 'CH', 'BN', 'PD'];

interface Props {
  onResultado: (data: any) => void;
}

export default function FormBusqueda({ onResultado }: Props) {
  const [ci, setCi] = useState('');
  const [expedido, setExpedido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const buscar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const data = await api('/api/certificados/buscar', {
        method: 'POST',
        body: JSON.stringify({ ci, expedido, fechaNacimiento }),
      });
      onResultado(data);
    } catch (err: any) {
      setError(err.message);
      onResultado(null);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={buscar} className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Cédula de Identidad</label>
        <input
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          placeholder="Ej. 123445 o 123445-B1 o 23434-E"
          required
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cscs-600"
        />
        <p className="text-xs text-gray-500 mt-1">
          Si su CI tiene complemento o extranjero, ingréselo en el mismo campo separado por guion.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Expedido</label>
          <select
            value={expedido}
            onChange={(e) => setExpedido(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cscs-600"
          >
            <option value="">-- Seleccionar --</option>
            {EXPEDIDOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cscs-600"
          />
        </div>
      </div>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

      <button
        type="submit"
        disabled={cargando}
        className="w-full bg-cscs-600 hover:bg-cscs-700 text-white py-2 rounded font-semibold disabled:opacity-50"
      >
        {cargando ? 'Buscando...' : '🔍 Buscar Certificados'}
      </button>
    </form>
  );
}