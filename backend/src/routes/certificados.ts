import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from '../middleware/requireAuth';
import { generarCodigoCertificado } from '../lib/codigo';
import { generarPDFCertificado } from '../lib/pdf';

const router = Router();

// ============================================
// POST /api/certificados/buscar — PÚBLICO
// ============================================
router.post('/buscar', async (req, res) => {
  const { ci, expedido, fechaNacimiento } = req.body ?? {};
  if (!ci || !expedido || !fechaNacimiento) {
    return res.status(400).json({
      error: 'Complete cédula, expedido y fecha de nacimiento.',
    });
  }

  const fecha = new Date(fechaNacimiento);
  const desde = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const hasta = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate() + 1);

  const estudiante = await prisma.estudiante.findFirst({
    where: {
      ci: String(ci).trim(),
      expedido: String(expedido).trim(),
      fechaNacimiento: { gte: desde, lt: hasta },
    },
    include: {
      certificados: {
        include: { curso: true },
        orderBy: { fechaEmision: 'desc' },
      },
    },
  });

  if (!estudiante) {
    return res.status(404).json({
      error:
        'No se encontraron datos con los criterios ingresados. Verifique su CI, expedido y fecha de nacimiento.',
    });
  }

  res.json({
    estudiante: {
      nombreCompleto: estudiante.nombreCompleto,
      ci: estudiante.ci,
      expedido: estudiante.expedido,
    },
    certificados: estudiante.certificados.map((c) => ({
      codigo: c.codigo,
      curso: c.curso.nombre,
      notaFinal: c.notaFinal,
      fechaEmision: c.fechaEmision,
    })),
  });
});

// ============================================
// GET /api/certificados/verificar/:codigo — PÚBLICO
// ============================================
router.get('/verificar/:codigo', async (req, res) => {
  const cert = await prisma.certificado.findUnique({
    where: { codigo: req.params.codigo },
    include: { estudiante: true, curso: true },
  });
  if (!cert) {
    return res.status(404).json({ valido: false, error: 'Certificado no encontrado' });
  }
  res.json({
    valido: true,
    certificado: {
      codigo: cert.codigo,
      estudiante: cert.estudiante.nombreCompleto,
      ci: `${cert.estudiante.ci}-${cert.estudiante.expedido}`,
      curso: cert.curso.nombre,
      cargaHoraria: cert.curso.cargaHoraria,
      modalidad: cert.curso.modalidad,
      notaFinal: cert.notaFinal,
      fechaEmision: cert.fechaEmision,
    },
  });
});

// ============================================
// GET /api/certificados/:codigo/pdf — PÚBLICO
// ============================================
router.get('/:codigo/pdf', async (req, res) => {
  const cert = await prisma.certificado.findUnique({
    where: { codigo: req.params.codigo },
    include: { estudiante: true, curso: true },
  });
  if (!cert) return res.status(404).json({ error: 'Certificado no encontrado' });

  const pdf = await generarPDFCertificado({
    codigo: cert.codigo,
    estudianteNombre: cert.estudiante.nombreCompleto,
    estudianteCI: cert.estudiante.ci,
    estudianteExpedido: cert.estudiante.expedido,
    cursoNombre: cert.curso.nombre,
    cursoCargaHoraria: cert.curso.cargaHoraria,
    cursoModalidad: cert.curso.modalidad,
    cursoFechaInicio: cert.curso.fechaInicio,
    cursoFechaFin: cert.curso.fechaFin,
    notaFinal: cert.notaFinal,
    fechaEmision: cert.fechaEmision,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="certificado-${cert.codigo}.pdf"`
  );
  res.send(pdf);
});

// ============================================
// POST /api/certificados — ADMIN (emitir)
// ============================================
router.post('/', requireAuth, async (req, res) => {
  try {
    const { estudianteId, cursoId, notaFinal } = req.body;
    if (!estudianteId || !cursoId || notaFinal === undefined) {
      return res
        .status(400)
        .json({ error: 'Faltan: estudianteId, cursoId, notaFinal' });
    }

    const existe = await prisma.certificado.findFirst({
      where: { estudianteId, cursoId },
    });
    if (existe) {
      return res.status(400).json({
        error: 'Este estudiante ya tiene un certificado para este curso',
      });
    }

    let codigo = generarCodigoCertificado();
    let intentos = 0;
    while (intentos < 5) {
      const colision = await prisma.certificado.findUnique({ where: { codigo } });
      if (!colision) break;
      codigo = generarCodigoCertificado();
      intentos++;
    }

    const certificado = await prisma.certificado.create({
      data: {
        codigo,
        estudianteId,
        cursoId,
        notaFinal: Number(notaFinal),
      },
      include: { estudiante: true, curso: true },
    });
    res.status(201).json(certificado);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// ============================================
// DELETE /api/certificados/:id — ADMIN
// ============================================
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await prisma.certificado.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;