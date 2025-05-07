import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              {/* Placeholder Logo */}
              <Image src="/images/BH_logo_128X128.png" alt="Business Holiday Booking Logo" width={40} height={40} />
              <span className="ml-2 text-xl font-bold text-white">Business Holiday Booking</span>
            </div>
            <p className="text-sm">
              Seamlessly integrate business travel with leisure opportunities. Discover events, find accommodation and flights, and plan your perfect biz-leisure trip.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-white transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors duration-200">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="hover:text-white transition-colors duration-200">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/help#faqs" className="hover:text-white transition-colors duration-200">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/about#how-it-works" className="hover:text-white transition-colors duration-200">
                  How it works
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Icons (Placeholders) */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Replace with actual icons and links */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                {/* Placeholder Icon 1 */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.232 4.012c-.742.33-1.537.555-2.36.656a4.36 4.36 0 001.917-2.264c-.806.477-1.693.82-2.63 1.01a4.36 4.36 0 00-7.456 3.952 12.35 12.35 0 01-8.93-4.513 4.36 4.36 0 001.359 5.813c-.66-.02-1.28-.202-1.825-.503v.056a4.36 4.36 0 003.495 4.274 4.37 4.37 0 01-1.96.075 4.36 4.36 0 004.062 3.023 8.73 8.73 0 01-5.417 1.868c-.352 0-.697-.02-1.038-.06a12.36 12.36 0 006.673 1.95c8.006 0 12.36-6.622 12.36-12.36 0-.188-.004-.375-.013-.563a8.85 8.85 0 002.163-2.258z"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                {/* Placeholder Icon 2 */}
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.83 9.5v-6.533H5.403V12.017H8.83V9.413c0-3.485 2.08-5.455 5.258-5.455 1.45 0 2.804.259 2.804.259v3.087h-1.58c-1.562 0-2.058.964-2.058 1.963v2.3l3.493-.001 1.044-3.538h3.398L16.643 12.02h3.295v3.017h-3.295V21.5c3.966-1.32 6.83-5.075 6.83-9.5C22 6.484 17.523 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
              {/* Add more social media icons as needed */}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Business Holiday Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
