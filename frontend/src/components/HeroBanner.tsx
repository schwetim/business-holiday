import React from 'react';
import { useRouter } from 'next/router';

const HeroBanner = () => {
  const router = useRouter();

  const handleHeadlineClick = () => {
    if (window.confirm("Navigating home will clear all your current selections. Proceed?")) {
      router.push('/');
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div onClick={handleHeadlineClick} className="cursor-pointer">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Make Business Trips Feel Like Holidays
          </h1>
        </div>
        <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
          Discover work-related events in beautiful destinations — and book everything you need, from flights to hotels.
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
