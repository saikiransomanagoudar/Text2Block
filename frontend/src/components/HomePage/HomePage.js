import React, { useState } from "react";
import Header from "../Header/Header";
import { Download } from "lucide-react";

const HomePage = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExpandedView, setShowExpandedView] = useState(false);

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze text");
      }
      const data = await response.json();
      const processExplanation = (text) => {
        try {
          if (typeof text !== 'string') {
            return text.explanation || text;
          }

          let cleanText = text;
          if (cleanText.includes('```')) {
            cleanText = cleanText.replace(/```\w*\n/g, '').replace(/\n```/g, '');
          }

          let parsedData;
          try {

            parsedData = JSON.parse(cleanText);
          } catch (e) {
            try {

              cleanText = cleanText.replace(/\\\"/g, '"').replace(/\\/g, '');
              parsedData = JSON.parse(cleanText);
            } catch (e2) {

              cleanText = cleanText.replace(/^"(.*)"$/, '$1');
              parsedData = JSON.parse(cleanText);
            }
          }

          return parsedData.explanation || parsedData;
        } catch (error) {
          console.error('Error parsing explanation:', error);
          return {
            overview: 'Error processing explanation',
            details: [{
              heading: 'Raw Response',
              description: text
            }]
          };
        }
      };

      setResult({
        flowchart: `data:image/jpeg;base64,${data.flowchart}`,
        explanation: processExplanation(data.explanation)
      });
    } catch (error) {
      setError("Failed to process the response. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.flowchart;
    link.download = "flowchart.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderExplanation = () => {
    if (!result?.explanation) return null;

    const { overview, details } = result.explanation;

    return (
      <div className="space-y-6">
        {overview && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Overview</h3>
            <p className="text-gray-700 leading-relaxed">{overview}</p>
          </div>
        )}
        
        {details && details.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-3">Details</h3>
            <div className="space-y-4">
              {details.map((detail, index) => (
                <div 
                  key={index} 
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-lg mb-2">{detail.heading}</h4>
                  <p className="text-gray-700 leading-relaxed">{detail.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Header />

      <main className="px-4 py-8">
        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Enter Your Text</h2>
            <textarea
              className="w-full h-32 p-3 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Enter your text here to generate a flowchart..."
            />

            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="mt-2 text-sm text-gray-600 italic">
              Note: Text2Block can make mistakes. Please check important info.
            </div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Processing..." : "Get Result"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
            {/* Flowchart Result */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
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
                <div className="w-full h-[calc(100vh-24rem)] bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto">
                  <img
                    src={result.flowchart}
                    alt="Generated Flowchart"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={20} />
                    Download Image
                  </button>
                </div>
              </div>
            </div>

            {/* Explanation Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                <h2 className="text-2xl font-bold mb-4">Explanation</h2>
                <div className="overflow-auto h-[calc(100vh-20rem)]">
                  {renderExplanation()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded View Modal */}
        {showExpandedView && result && (
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
                <img
                  src={result.flowchart}
                  alt="Generated Flowchart"
                  className="w-full"
                />
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={20} />
                    Download Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;