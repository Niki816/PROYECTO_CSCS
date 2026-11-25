import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// GET /api/cursos — PÚBLICO
router.get('/', async (_req, res) => {
  const cursos = await prisma.curso.findMany({ orderBy: { creado: 'desc' } });
  res.json(cursos);
});

// GET /api/cursos/:id — PÚBLICO
router.get('/:id', async (req, res) => {
  const curso = await prisma.curso.findUnique({ where: { id: req.params.id } });
  if (!curso) return res.status(404).json({ error: 'Curso no encontrado' });
  res.json(curso);
});

// POST /api/cursos — ADMIN
router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      nombre, descripcion, imagenUrl,
      fechaInicio, fechaFin, cargaHoraria, modalidad,
    } = req.body;
    if (!nombre || !fechaInicio || !fechaFin || !cargaHoraria || !modalidad) {
      return res.status(400).json({
        error: 'Obligatorios: nombre, fechaInicio, fechaFin, cargaHoraria, modalidad',
      });
    }
    const curso = await prisma.curso.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        imagenUrl: imagenUrl || null,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        cargaHoraria: Number(cargaHoraria),
        modalidad,
      },
    });
    res.status(201).json(curso);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/cursos/:id — ADMIN
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const {
      nombre, descripcion, imagenUrl,
      fechaInicio, fechaFin, cargaHoraria, modalidad,
    } = req.body;
    const curso = await prisma.curso.update({
      where: { id: req.params.id },
      data: {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(imagenUrl !== undefined && { imagenUrl }),
        ...(fechaInicio !== undefined && { fechaInicio: new Date(fechaInicio) }),
        ...(fechaFin !== undefined && { fechaFin: new Date(fechaFin) }),
        ...(cargaHoraria !== undefined && { cargaHoraria: Number(cargaHoraria) }),
        ...(modalidad !== undefined && { modalidad }),
      },
    });
    res.json(curso);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/cursos/:id — ADMIN
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const certs = await prisma.certificado.count({
      where: { cursoId: req.params.id },
    });
    if (certs > 0) {
      return res.status(400).json({
        error: `No se puede eliminar: hay ${certs} certificado(s) asociados.`,
      });
    }
    await prisma.curso.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;