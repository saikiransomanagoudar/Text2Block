import React from 'react';
import { useUser } from '@clerk/clerk-react';
import Header from '../Header/Header';
import { ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { isSignedIn } = useUser();

  const handleNavigation = (path) => {
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      <main className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-center max-w-3xl px-4">
          <h2 className="text-6xl font-bold text-white mb-8">
            Introducing Text2Block
          </h2>
          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            Transform complex ideas into crystal-clear visuals! Our AI-powered magic turns your text into stunning flowcharts, paired with smart insights that make learning effortless.
          </p>
          <button
            onClick={() => handleNavigation(isSignedIn ? '/home' : '/sign-up')}
            className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;