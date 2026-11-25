import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Serif } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import SplashScreen from '@/components/SplashScreen';
import Footer from '@/components/Footer';

const sans = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CSCS · Centro Social de Capacitación Superior',
  description: 'Cursos de capacitación y certificados verificables del Centro Social de Capacitación Superior.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // app-loading: bloquea el scroll y pausa las animaciones hasta que termina el splash
    <html lang="es" className={`${sans.variable} ${serif.variable} app-loading`}>
      <body className="flex min-h-screen flex-col">
        {/* Si el navegador no tiene JavaScript, no dejamos la página oculta */}
        <noscript>
          <style>{`html.app-loading{overflow:auto!important}html.app-loading .reveal{opacity:1!important;animation:none!important}`}</style>
        </noscript>
        <SplashScreen />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}