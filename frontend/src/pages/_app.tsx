import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import HeroBanner from '@/components/HeroBanner';
import Footer from '@/components/Footer';
import TopNavbar from '@/components/TopNavbar';
import ProgressIndicator from '@/components/ProgressIndicator'; // Import the ProgressIndicator
import { AuthProvider } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Show progress indicator only on booking flow pages
  const showProgressIndicator = ['/accommodation', '/transportation', '/results'].includes(router.pathname) ||
    (router.pathname === '/' && router.query.eventId !== undefined);

  return (
    <AuthProvider>
      <TopNavbar />
      <HeroBanner />
      {showProgressIndicator && <ProgressIndicator />}
      <main className="container mx-auto px-4 pb-6">
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}
