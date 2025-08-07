
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import Footer from "../Components/Footer/page";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  tags?: string[];
}

const PracticeProblems: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
        setFilteredProblems(data);

        // Extract all unique tags
        const tagsSet = new Set<string>();
        data.forEach((problem: Problem) => {
          if (problem.tags) {
            problem.tags.forEach((tag) => tagsSet.add(tag));
          }
        });
        setAllTags(Array.from(tagsSet).sort());

        setLoading(false);
      } catch (err) {
        setError("Error fetching problems. Please try again later.");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    let updatedProblems = [...problems];
    const query = searchParams.get("query")?.toLowerCase();
    const tagQuery = searchParams.get("tag")?.toLowerCase();

    if (query) {
      updatedProblems = problems.filter(
        (problem) => problem.title.toLowerCase() === query
      );
    } else if (tagQuery) {
      updatedProblems = problems.filter(
        (problem) =>
          problem.tags &&
          problem.tags.some((tag) => tag.toLowerCase() === tagQuery)
      );
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      updatedProblems = updatedProblems.filter(
        (problem) =>
          problem.tags &&
          selectedTags.every((selectedTag) =>
            problem.tags!.some(
              (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
            )
          )
      );
    }

    // Apply sorting
    if (sortBy === "alphabetical") {
      updatedProblems.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "difficulty") {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      updatedProblems.sort(
        (a, b) =>
          (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 4) -
          (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 4)
      );
    }

    setFilteredProblems(updatedProblems);
  }, [sortBy, problems, searchParams, selectedTags]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeSelectedTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading problems...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-600 hover:text-green-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-green-600">
                Practice Problems
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 mr-8">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Tags
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-green-100 text-green-800 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {selectedTags.length > 0 && (
                  <button
                    onClick={clearAllTags}
                    className="w-full mt-4 px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
                  >
                    Clear All Tags
                  </button>
                )}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Coding Problems</h2>
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={handleSortChange}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="default">Default</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="difficulty">Difficulty</option>
                  </select>
                </div>
              </div>

              {/* Tag Bar */}
              {selectedTags.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      Active Filters:
                    </h4>
                    <button
                      onClick={clearAllTags}
                      className="text-xs text-gray-500 hover:text-red-600"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                      >
                        {tag}
                        <button
                          onClick={() => removeSelectedTag(tag)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Problems List */}
              <div className="grid grid-cols-1 gap-6">
                {filteredProblems.length === 0 ? (
                  <p className="text-gray-600 text-center">
                    No problems found for the selected filters.
                  </p>
                ) : (
                  filteredProblems.map((problem) => (
                    <div
                      key={problem._id}
                      className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold">{problem.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">
                            {problem.description}
                          </p>
                          <p className="text-gray-500 text-sm mt-2">
                            Difficulty: {problem.difficulty}
                          </p>
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {problem.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full cursor-pointer hover:bg-green-200"
                                  onClick={() => handleTagClick(tag)}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                          Solve Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PracticeProblems;























