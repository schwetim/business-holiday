import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import HeroBanner from '@/components/HeroBanner';
import TopNavbar from '@/components/TopNavbar';
import ProgressIndicator from '@/components/ProgressIndicator'; // Import the ProgressIndicator

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <TopNavbar />
      <HeroBanner />
      <ProgressIndicator /> {/* Add the progress indicator */}
      <main className="container mx-auto px-4 pb-6"> {/* Adjusted padding */}
        <Component {...pageProps} />
      </main>
      {/* Add Footer component here later if needed */}
    </>
  );
}
