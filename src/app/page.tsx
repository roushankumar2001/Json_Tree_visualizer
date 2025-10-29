'use client';

import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import JsonInput from './components/JsonInput';
import TreeView from './components/TreeView';
import { jsonToNodes } from './components/utils/jsonToNodes';
import { Moon, Sun, Search } from 'lucide-react';

export default function Home() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [matchedPath, setMatchedPath] = useState<string | null>(null);
  const [fullJson, setFullJson] = useState<any>(null);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const handleVisualize = (json: any) => {
    const { nodes, edges } = jsonToNodes(json, null, '$', 0, expandedPaths);
    setNodes(nodes);
    setEdges(edges);
    setFullJson(json);
    setExpandedPaths(new Set());
    setMatchedPath(null);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const cleanQuery = query.trim().toLowerCase();
    const found = nodes.find(
      (n) =>
        typeof n.path === 'string' &&
        (n.path.toLowerCase() === cleanQuery ||
          n.path.toLowerCase().endsWith(cleanQuery))
    );
    if (found) setMatchedPath(found.path);
    else alert('❌ No match found');
  };

  return (
    <main
      className={`min-h-screen p-4 sm:p-6 transition-colors ${
        dark ? 'bg-gray-900 text-white' : 'bg-white text-black'
      }`}
    >
      {/* 🌟 Top Header */}
      <header className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-2xl font-bold">JSON Tree Visualizer</h1>
        <button
          onClick={() => setDark(!dark)}
          className={`px-3 py-2 rounded flex items-center justify-center gap-1 text-sm sm:text-base transition-colors ${
            dark
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300 border border-gray-500'
              : 'bg-gray-200 hover:bg-gray-300 text-black border border-gray-400'
          }`}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
          {dark ? 'Light' : 'Dark'}
        </button>
      </header>

      {/* 🔍 Search Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="$.product"
            className={`border p-2 rounded flex-1 sm:w-64 w-full transition-colors ${
              dark
                ? 'bg-gray-800 text-white border-gray-600 placeholder-gray-400'
                : 'bg-white text-black border-gray-300 placeholder-gray-500'
            }`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className={`px-4 py-2 rounded flex items-center gap-1 transition-colors ${
              dark
                ? 'bg-blue-600 hover:bg-blue-500 text-white border border-blue-400'
                : 'bg-blue-500 hover:bg-blue-600 text-white border border-blue-600'
            }`}
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* 🧩 Color Legend */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-sm mb-4">
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-green-500 rounded"></div>
          Path Nodes
        </span>
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-yellow-400 rounded"></div>
          Descendants
        </span>
        <span className="flex items-center gap-1">
          <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
          Matched Node
        </span>
      </div>

      {/* 🧱 Layout: Input | Tree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <JsonInput onVisualize={handleVisualize} />
        <div
          className={`${
            dark ? 'bg-gray-800' : 'bg-gray-100'
          } p-2 sm:p-3 rounded border border-gray-400`}
        >
          <ReactFlowProvider>
            <TreeView
              nodes={nodes}
              edges={edges}
              dark={dark}
              matchedPath={matchedPath}
              fullJson={fullJson}
              setNodes={setNodes}
              setEdges={setEdges}
              expandedPaths={expandedPaths}
              setExpandedPaths={setExpandedPaths}
            />
          </ReactFlowProvider>
        </div>
      </div>
    </main>
  );
}
