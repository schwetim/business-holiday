import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>
      <p className="mb-4">
        Welcome to Business Holiday Booking. Our mission is to seamlessly integrate business travel with leisure opportunities,
        helping professionals discover events in exciting destinations and easily plan their extended trips.
      </p>
      <h2 className="text-2xl font-semibold mb-4">How Our Service Works</h2>
      <p className="mb-4">
        We provide a curated platform where you can find business events based on your industry, location, and dates.
        Once you find an event, we help you find suitable accommodation and transportation options from our trusted affiliate partners.
        We don't handle bookings directly; instead, we provide you with the information and links you need to book with our partners.
      </p>
      <p>
        Our goal is to make combining business and leisure travel simple and efficient, allowing you to maximize your trip's potential.
      </p>
    </div>
  );
};

export default AboutPage;
