'use client';
import { useState } from 'react';

export default function JsonInput({ onVisualize }: { onVisualize: (json: any) => void }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleClick = () => {
    try {
      const json = JSON.parse(text);
      setError('');
      onVisualize(json);
    } catch {
      setError('❌ Invalid JSON format');
    }
  };

  return (
    <div>
      <p className="mb-2 text-sm">Paste or type JSON data</p>
      <textarea
        className="w-full h-64 border rounded p-2 font-mono text-sm"
        placeholder='{  "product": {"id": 1, "name": "Dove","price":"Rs 10"}}'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleClick}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Generate Tree
      </button>
    </div>
  );
}
