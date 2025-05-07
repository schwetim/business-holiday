import React from 'react';

const HeroBanner = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8 relative">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 z-0"
        style={{
          backgroundImage: 'url(/assets/images/heroBanner.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay',
        }}
      ></div>

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div>
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
