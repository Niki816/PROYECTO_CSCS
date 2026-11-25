import QRCode from 'qrcode';

export async function generarQRDataUrl(texto: string): Promise<string> {
  return QRCode.toDataURL(texto, {
    errorCorrectionLevel: 'H',
    margin: 1,
    width: 400,
    color: { dark: '#1e3a8a', light: '#ffffff' },
  });
}