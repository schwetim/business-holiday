import React, { FC } from 'react';

interface HeroBannerProps {
  // Can add props here if needed
}

const HeroBanner: FC<HeroBannerProps> = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Make Business Trips Feel Like Holidays
        </h1>
        <p className="mt-6 text-xl text-gray-700 max-w-3xl mx-auto">
          Discover work-related events in beautiful destinations — and book everything you need, from flights to hotels.
        </p>
      </div>
    </div>
  );
};

export default HeroBanner;
