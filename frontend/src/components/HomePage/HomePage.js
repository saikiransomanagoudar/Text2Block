import React, { useState } from "react";
import Header from "../Header/Header";
import { Download } from "lucide-react";
import LoadingAnimation from "../LoadingAnimation";

const HomePage = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showExpandedView, setShowExpandedView] = useState(false);

  const samplePrompts = [
    "Explain the Bubble sorting algorithm in detail with an array example.",
    "Help me with the process of making Masoor Dal.",
    "Explain the detailed process of Glycolysis.",
  ];

  const handleSamplePromptClick = (prompt) => {
    setUserPrompt(prompt);
  };

  const handleSubmit = async () => {
    if (!userPrompt.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/analyze`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: userPrompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to analyze text");
      }
      const data = await response.json();
      const processExplanation = (text) => {
        try {
          if (typeof text !== "string") {
            return text.explanation || text;
          }

          let cleanText = text;
          if (cleanText.includes("```")) {
            cleanText = cleanText
              .replace(/```\w*\n/g, "")
              .replace(/\n```/g, "");
          }

          let parsedData;
          try {
            parsedData = JSON.parse(cleanText);
          } catch (e) {
            try {
              cleanText = cleanText.replace(/\\\"/g, '"').replace(/\\/g, "");
              parsedData = JSON.parse(cleanText);
            } catch (e2) {
              cleanText = cleanText.replace(/^"(.*)"$/, "$1");
              parsedData = JSON.parse(cleanText);
            }
          }

          return parsedData.explanation || parsedData;
        } catch (error) {
          console.error("Error parsing explanation:", error);
          return {
            overview: "Error processing explanation",
            details: [
              {
                heading: "Raw Response",
                description: text,
              },
            ],
          };
        }
      };

      setResult({
        flowchart: `data:image/jpeg;base64,${data.flowchart}`,
        explanation: processExplanation(data.explanation),
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
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-2">
                    {detail.heading}
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {detail.description}
                  </p>
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
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl shadow-2xl p-8 border border-gray-700">
            {/* Description */}
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Text2Block</h2>
              <p className="text-gray-300 text-lg mb-6">
                Where your words take shape: Text2Block turns your ideas into
                vibrant flowcharts, complete with AI-powered insights
              </p>
              <p className="text-gray-400">
                Ready to flow? Dive into these starter prompts
              </p>
            </div>

            {/* Sample Prompts */}
            <div className="grid gap-2 mb-6">
              {samplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSamplePromptClick(prompt)}
                  className="text-left p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-md text-gray-300 transition-all duration-200 hover:shadow-lg border border-gray-600 hover:border-gray-500 text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <textarea
              className="w-full h-40 p-4 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-800 placeholder-gray-500 transition-all duration-200"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Transform your thoughts into flowing diagrams..."
              style={{ resize: "vertical" }}
            />

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-2 text-sm text-gray-400 italic">
              Note: Text2Block can make mistakes. Please check important info.
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              {isLoading ? <LoadingAnimation /> : "Blockify!"}
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
                  <h2 className="text-2xl font-bold">Result</h2>
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
