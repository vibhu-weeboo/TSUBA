import React, { useState } from 'react';
import { Search, Book, FileText, ExternalLink } from 'lucide-react';

interface ResearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: string;
}

const Research: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ResearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/research/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Book className="w-6 h-6 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Research Assistant</h1>
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter your research query..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {result.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{result.snippet}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {result.source}
                      </span>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit source
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Start your research by entering a query above</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Research;
