import crypto from 'crypto';

// Alfabeto sin 0/O/1/I para evitar confusión al escanear el QR
const ALFABETO = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export function generarCodigoCertificado(): string {
  const anio = new Date().getFullYear();
  const bloques: string[] = [];

  for (let b = 0; b < 3; b++) {
    let bloque = '';
    for (let i = 0; i < 4; i++) {
      bloque += ALFABETO[crypto.randomInt(0, ALFABETO.length)];
    }
    bloques.push(bloque);
  }

  return `CSCS-${anio}-${bloques.join('-')}`;
}