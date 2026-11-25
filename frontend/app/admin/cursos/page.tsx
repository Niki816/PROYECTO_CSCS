'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const MODALIDADES = ['Presencial', 'Virtual', 'Mixta'];

const FORM_VACIO = {
  nombre: '',
  descripcion: '',
  imagenUrl: '',
  fechaInicio: '',
  fechaFin: '',
  cargaHoraria: '',
  modalidad: 'Presencial',
};

export default function AdminCursos() {
  const [cursos, setCursos] = useState<any[]>([]);
  const [form, setForm] = useState({ ...FORM_VACIO });
  const [editando, setEditando] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const cargar = () => api<any[]>('/api/cursos').then(setCursos);

  useEffect(() => { cargar(); }, []);

  const subirImagen = async (file: File) => {
    setSubiendo(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ''
      );
      const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        { method: 'POST', body: fd }
      );
      const data = await res.json();
      if (!data.secure_url) throw new Error('No se pudo subir la imagen');
      setForm((f) => ({ ...f, imagenUrl: data.secure_url }));
    } catch (e: any) {
      setMensaje('Error al subir imagen: ' + e.message);
    } finally {
      setSubiendo(false);
    }
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...form, cargaHoraria: Number(form.cargaHoraria) };
      if (editando) {
        await api(`/api/cursos/${editando}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setMensaje('✅ Curso actualizado');
      } else {
        await api('/api/cursos', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setMensaje('✅ Curso creado');
      }
      setForm({ ...FORM_VACIO });
      setEditando(null);
      cargar();
    } catch (err: any) {
      setMensaje('❌ ' + err.message);
    }
  };

  const editar = (c: any) => {
    setForm({
      nombre: c.nombre,
      descripcion: c.descripcion || '',
      imagenUrl: c.imagenUrl || '',
      fechaInicio: c.fechaInicio.slice(0, 10),
      fechaFin: c.fechaFin.slice(0, 10),
      cargaHoraria: String(c.cargaHoraria),
      modalidad: c.modalidad,
    });
    setEditando(c.id);
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar este curso?')) return;
    try {
      await api(`/api/cursos/${id}`, { method: 'DELETE' });
      cargar();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-cscs-800 mb-4">Gestión de Cursos</h1>

      <form onSubmit={guardar} className="bg-white p-5 rounded shadow mb-6 space-y-3">
        <h2 className="font-semibold text-gray-700">
          {editando ? '✏️ Editar Curso' : '➕ Crear Curso'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            placeholder="Nombre del curso"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="date"
            value={form.fechaFin}
            onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <input
            type="number"
            placeholder="Carga horaria (horas)"
            value={form.cargaHoraria}
            onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })}
            required
            className="border rounded px-3 py-2"
          />
          <select
            value={form.modalidad}
            onChange={(e) => setForm({ ...form, modalidad: e.target.value })}
            className="border rounded px-3 py-2"
          >
            {MODALIDADES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && subirImagen(e.target.files[0])}
            className="text-sm"
          />
          {subiendo && <span className="text-xs text-blue-600">Subiendo...</span>}
          {form.imagenUrl && (
            <span className="text-xs text-green-600">✓ Imagen cargada</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-cscs-600 hover:bg-cscs-700 text-white px-4 py-2 rounded font-medium"
          >
            {editando ? 'Actualizar' : 'Crear'}
          </button>
          {editando && (
            <button
              type="button"
              onClick={() => { setForm({ ...FORM_VACIO }); setEditando(null); }}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>

        {mensaje && <p className="text-sm text-gray-700">{mensaje}</p>}
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2">Nombre</th>
              <th className="text-left px-3 py-2">Fechas</th>
              <th className="text-left px-3 py-2">Horas</th>
              <th className="text-left px-3 py-2">Modalidad</th>
              <th className="text-left px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cursos.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{c.nombre}</td>
                <td className="px-3 py-2 text-xs">
                  {c.fechaInicio.slice(0, 10)} → {c.fechaFin.slice(0, 10)}
                </td>
                <td className="px-3 py-2">{c.cargaHoraria}</td>
                <td className="px-3 py-2">{c.modalidad}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    onClick={() => editar(c)}
                    className="text-blue-600 hover:underline text-xs"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(c.id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  No hay cursos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}