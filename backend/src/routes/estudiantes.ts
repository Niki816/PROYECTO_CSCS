import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

// GET /api/estudiantes — ADMIN (listado)
router.get('/', requireAuth, async (_req, res) => {
  const estudiantes = await prisma.estudiante.findMany({
    orderBy: { creado: 'desc' },
    include: { _count: { select: { certificados: true } } },
  });
  res.json(estudiantes);
});

// GET /api/estudiantes/buscar?ci=...&expedido=... — ADMIN (autocompletar)
router.get('/buscar', requireAuth, async (req, res) => {
  const { ci, expedido } = req.query;
  if (!ci || !expedido) {
    return res.status(400).json({ error: 'Parámetros ci y expedido requeridos' });
  }
  const estudiante = await prisma.estudiante.findFirst({
    where: { ci: String(ci).trim(), expedido: String(expedido).trim() },
  });
  res.json(estudiante ?? null);
});

// POST /api/estudiantes — ADMIN
router.post('/', requireAuth, async (req, res) => {
  try {
    const { nombreCompleto, ci, expedido, fechaNacimiento } = req.body;
    if (!nombreCompleto || !ci || !expedido || !fechaNacimiento) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const estudiante = await prisma.estudiante.create({
      data: {
        nombreCompleto,
        ci: String(ci).trim(),
        expedido: String(expedido).trim(),
        fechaNacimiento: new Date(fechaNacimiento),
      },
    });
    res.status(201).json(estudiante);
  } catch (e: any) {
    if (e.code === 'P2002') {
      return res.status(400).json({
        error: 'Ya existe un estudiante con ese CI y expedido',
      });
    }
    res.status(400).json({ error: e.message });
  }
});

export default router;