'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const EXPEDIDOS = ['LP', 'CB', 'SC', 'OR', 'PT', 'TJ', 'CH', 'BN', 'PD'];

export default function AdminCertificados() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [estudianteId, setEstudianteId] = useState<string | null>(null);
  const [formEst, setFormEst] = useState({
    nombreCompleto: '',
    ci: '',
    expedido: '',
    fechaNacimiento: '',
  });
  const [cursoId, setCursoId] = useState('');
  const [notaFinal, setNotaFinal] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [codigoEmitido, setCodigoEmitido] = useState('');

  useEffect(() => {
    api<any[]>('/api/cursos').then(setCursos);
  }, []);

  const buscarEstudiante = async () => {
    if (!formEst.ci || !formEst.expedido) {
      setMensaje('⚠️ Ingrese CI y Expedido para buscar');
      return;
    }
    try {
      const est = await api<any>(
        `/api/estudiantes/buscar?ci=${encodeURIComponent(formEst.ci)}&expedido=${formEst.expedido}`
      );
      if (est) {
        setEstudianteId(est.id);
        setFormEst({
          nombreCompleto: est.nombreCompleto,
          ci: est.ci,
          expedido: est.expedido,
          fechaNacimiento: est.fechaNacimiento.slice(0, 10),
        });
        setMensaje('✅ Estudiante encontrado, puede emitir el certificado');
      } else {
        setEstudianteId(null);
        setMensaje('ℹ️ Estudiante no encontrado, complete los datos para crearlo');
      }
    } catch (e: any) {
      setMensaje('❌ ' + e.message);
    }
  };

  const emitir = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setCodigoEmitido('');
    try {
      let estId = estudianteId;
      if (!estId) {
        const nuevo = await api<any>('/api/estudiantes', {
          method: 'POST',
          body: JSON.stringify(formEst),
        });
        estId = nuevo.id;
      }
      const cert = await api<any>('/api/certificados', {
        method: 'POST',
        body: JSON.stringify({
          estudianteId: estId,
          cursoId,
          notaFinal: Number(notaFinal),
        }),
      });
      setCodigoEmitido(cert.codigo);
      setMensaje('✅ Certificado emitido correctamente');
      setFormEst({ nombreCompleto: '', ci: '', expedido: '', fechaNacimiento: '' });
      setEstudianteId(null);
      setCursoId('');
      setNotaFinal('');
    } catch (err: any) {
      setMensaje('❌ ' + err.message);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-cscs-800 mb-4">Emitir Certificado</h1>

      <form onSubmit={emitir} className="bg-white p-5 rounded shadow space-y-4">
        <h2 className="font-semibold text-gray-700 border-b pb-2">1. Datos del Estudiante</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            placeholder="CI (ej. 123445 o 123445-B1)"
            value={formEst.ci}
            onChange={(e) => { setFormEst({ ...formEst, ci: e.target.value }); setEstudianteId(null); }}
            className="border rounded px-3 py-2"
          />
          <select
            value={formEst.expedido}
            onChange={(e) => { setFormEst({ ...formEst, expedido: e.target.value }); setEstudianteId(null); }}
            className="border rounded px-3 py-2"
          >
            <option value="">-- Expedido --</option>
            {EXPEDIDOS.map((x) => <option key={x} value={x}>{x}</option>)}
          </select>
          <button
            type="button"
            onClick={buscarEstudiante}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            🔍 Buscar existente
          </button>
        </div>

        <input
          placeholder="Nombre completo"
          value={formEst.nombreCompleto}
          onChange={(e) => setFormEst({ ...formEst, nombreCompleto: e.target.value })}
          required
          className="border rounded px-3 py-2 w-full"
        />
        <div>
          <label className="block text-sm mb-1">Fecha de nacimiento</label>
          <input
            type="date"
            value={formEst.fechaNacimiento}
            onChange={(e) => setFormEst({ ...formEst, fechaNacimiento: e.target.value })}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <h2 className="font-semibold text-gray-700 border-b pb-2 pt-2">
          2. Datos del Certificado
        </h2>

        <select
          value={cursoId}
          onChange={(e) => setCursoId(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        >
          <option value="">-- Seleccionar curso --</option>
          {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </select>

        <input
          type="number"
          min={0}
          max={100}
          placeholder="Nota final (0-100)"
          value={notaFinal}
          onChange={(e) => setNotaFinal(e.target.value)}
          required
          className="border rounded px-3 py-2 w-full"
        />

        {mensaje && <p className="text-sm p-2 bg-gray-50 rounded">{mensaje}</p>}

        {codigoEmitido && (
          <div className="bg-green-50 border border-green-400 rounded p-3 text-sm">
            <p className="font-semibold text-green-800">Certificado emitido</p>
            <p className="text-gray-700">Código: <code className="bg-white px-2 py-0.5 rounded">{codigoEmitido}</code></p>
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/api/certificados/${codigoEmitido}/pdf`}
              target="_blank"
              className="text-blue-600 hover:underline text-xs"
            >
              Descargar PDF →
            </a>
          </div>
        )}

        <button
          type="submit"
          className="bg-cscs-600 hover:bg-cscs-700 text-white px-6 py-2 rounded font-semibold w-full"
        >
          🎓 Emitir Certificado
        </button>
      </form>
    </div>
  );
}