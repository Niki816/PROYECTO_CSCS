import PDFDocument from 'pdfkit';
import { generarQRDataUrl } from './qr';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

export interface CertificadoPDFData {
  codigo: string;
  estudianteNombre: string;
  estudianteCI: string;
  estudianteExpedido: string;
  cursoNombre: string;
  cursoCargaHoraria: number;
  cursoModalidad: string;
  cursoFechaInicio: Date;
  cursoFechaFin: Date;
  notaFinal: number;
  fechaEmision: Date;
}

const MESES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre',
];

const formatoFecha = (d: Date) =>
  `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;

export async function generarPDFCertificado(
  data: CertificadoPDFData
): Promise<Buffer> {
  const qrUrl = `${FRONTEND_URL}/verificar/${data.codigo}`;
  const qrDataUrl = await generarQRDataUrl(qrUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
  const chunks: Buffer[] = [];
  doc.on('data', (c) => chunks.push(c));
  const finishPromise = new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  const W = doc.page.width;
  const H = doc.page.height;

  // --- Bordes decorativos ---
  doc.rect(20, 20, W - 40, H - 40).lineWidth(3).stroke('#1e3a8a');
  doc.rect(30, 30, W - 60, H - 60).lineWidth(1).stroke('#1e3a8a');

  // --- Header ---
  doc.fillColor('#1e3a8a').fontSize(20).font('Helvetica-Bold');
  doc.text('CENTRO SOCIAL DE CAPACITACIÓN SUPERIOR', 0, 65, { align: 'center' });

  doc.fontSize(11).font('Helvetica').fillColor('#555');
  doc.text('— CSCS —', 0, 95, { align: 'center' });

  // --- Título ---
  doc.fillColor('#1e3a8a').fontSize(38).font('Helvetica-Bold');
  doc.text('CERTIFICADO', 0, 145, { align: 'center' });

  doc.fillColor('#666').fontSize(13).font('Helvetica');
  doc.text('DE PARTICIPACIÓN', 0, 192, { align: 'center' });

  // --- Otorgado a ---
  doc.fillColor('#333').fontSize(13).font('Helvetica');
  doc.text('Se otorga el presente certificado a:', 0, 235, { align: 'center' });

  doc.fillColor('#1e3a8a').fontSize(26).font('Helvetica-Bold');
  doc.text(data.estudianteNombre.toUpperCase(), 0, 265, { align: 'center' });

  doc.fillColor('#333').fontSize(12).font('Helvetica');
  doc.text(`C.I. ${data.estudianteCI}-${data.estudianteExpedido}`, 0, 305, {
    align: 'center',
  });

  // --- Curso ---
  doc.fontSize(13).text('Por haber culminado satisfactoriamente el curso:', 0, 345, {
    align: 'center',
  });

  doc.fillColor('#1e3a8a').fontSize(16).font('Helvetica-Bold');
  doc.text(data.cursoNombre.toUpperCase(), 0, 370, { align: 'center', width: W });

  // --- Detalles ---
  doc.fillColor('#333').fontSize(11).font('Helvetica');
  doc.text(
    `Modalidad: ${data.cursoModalidad}   |   Carga horaria: ${data.cursoCargaHoraria} horas   |   Nota final: ${data.notaFinal}/100`,
    0, 415, { align: 'center' }
  );
  doc.text(
    `Del ${formatoFecha(data.cursoFechaInicio)} al ${formatoFecha(data.cursoFechaFin)}`,
    0, 435, { align: 'center' }
  );

  // --- QR (esquina inferior izquierda) ---
  doc.image(qrBuffer, 60, H - 180, { width: 100 });
  doc.fontSize(8).fillColor('#666').font('Helvetica');
  doc.text('Escanee para verificar', 55, H - 75, { width: 110, align: 'center' });

  // --- Código + fecha (abajo centro) ---
  doc.fontSize(9).fillColor('#666').font('Helvetica');
  doc.text(`Código: ${data.codigo}`, 0, H - 55, { align: 'center' });
  doc.text(`Emitido el ${formatoFecha(data.fechaEmision)}`, 0, H - 40, {
    align: 'center',
  });

  // --- Firma (abajo derecha) ---
  const firmaX = W - 300;
  const firmaY = H - 190;
  doc
    .moveTo(firmaX, firmaY + 60)
    .lineTo(firmaX + 220, firmaY + 60)
    .stroke('#333');
  doc.fontSize(10).fillColor('#333').font('Helvetica-Bold');
  doc.text('Lic. Juan Pérez', firmaX, firmaY + 65, {
    width: 220,
    align: 'center',
  });
  doc.fontSize(9).font('Helvetica');
  doc.text('Director Académico', firmaX, firmaY + 80, {
    width: 220,
    align: 'center',
  });

  doc.end();
  return finishPromise;
}