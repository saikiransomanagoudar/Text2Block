import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../Header/Header';

const LandingPage = () => {
  const { isSignedIn } = useUser();

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      <main className="max-w-7xl mx-auto mt-20 px-4">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Visualize Flowchart of Dimension Reduction
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Convert your text into a flowchart that visualizes the dimension reduction process.
          </p>
          <button
            onClick={() => handleNavigation(isSignedIn ? '/dashboard' : '/sign-up')}
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;