'use client';
import { useState } from 'react';

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');

  return (
    <div className="flex gap-2 p-2">
      <input
        className="border p-2 flex-1 rounded"
        placeholder="Search path (e.g. $.user.address.city)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={() => onSearch(query)}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
    </div>
  );
}
