import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import HeroBanner from '@/components/HeroBanner';
import Footer from '@/components/Footer';
import TopNavbar from '@/components/TopNavbar';
import ProgressIndicator from '@/components/ProgressIndicator'; // Import the ProgressIndicator
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <TopNavbar />
      <HeroBanner />
      <ProgressIndicator /> {/* Add the progress indicator */}
      <main className="container mx-auto px-4 pb-6"> {/* Adjusted padding */}
        <Component {...pageProps} />
      </main>
      <Footer />
    </AuthProvider>
  );
}
