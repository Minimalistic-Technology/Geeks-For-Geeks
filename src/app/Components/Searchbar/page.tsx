"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSearch(searchTerm.trim());
      router.push(`/?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search problems, tags, or languages..."
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
