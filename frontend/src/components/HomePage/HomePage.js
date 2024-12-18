import React, { useState } from 'react';
import Header from '../Header/Header';

const HomePage = () => {
  const [userPrompt, setUserPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showExpandedView, setShowExpandedView] = useState(false);

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Enter The Text Prompt</h2>
          <textarea
            className="w-full h-32 p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            placeholder="Enter your text prompt here to generate a flowchart..."
          />
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Get Result'}
          </button>
        </div>

        {result && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Flowchart Result</h2>
                <button
                  onClick={() => setShowExpandedView(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Expand view"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                  </svg>
                </button>
              </div>
              <div className="w-full h-64 bg-gray-50 rounded-lg p-4 border border-gray-200">
                {result.flowchart}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Explanation</h2>
              <div className="prose max-w-none">
                {result.explanation}
              </div>
            </div>
          </>
        )}

        {showExpandedView && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-auto">
              <div className="p-4 flex justify-between items-center border-b">
                <h3 className="text-xl font-semibold">Expanded View</h3>
                <button
                  onClick={() => setShowExpandedView(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {result?.flowchart}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;