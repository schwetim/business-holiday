import React from 'react';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help Center</h1>
      <p className="mb-4">
        Welcome to the Business Holiday Booking Help Center. Find answers to frequently asked questions and guides on how to use our service.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>How do I search for events?</li>
            <li>How do I book accommodation and flights?</li>
            <li>What is the difference between recommended trips and searching for events?</li>
            <li>How do I contact support?</li>
            {/* Add more FAQs as needed */}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <p>
            Learn more about the step-by-step process of planning your business holiday with our service.
          </p>
          {/* Link to a detailed "How It Works" section or page */}
          <p className="mt-4">
            <a href="/about#how-it-works" className="text-blue-600 hover:underline">Read our "How It Works" guide</a>
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
        <p>
          If you can't find the answer to your question, please don't hesitate to contact us.
        </p>
        <p className="mt-4">
          <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default HelpCenterPage;
