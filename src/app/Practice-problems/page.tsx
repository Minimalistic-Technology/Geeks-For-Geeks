// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { ArrowLeft } from "lucide-react";
// import Footer from "../Components/Footer/page";

// interface Problem {
//   _id: string;
//   title: string;
//   difficulty: string;
//   description: string;
//   tags?: string[];
// }

// const PracticeProblems: React.FC = () => {
//   const router = useRouter();
//   const [problems, setProblems] = useState<Problem[]>([]);
//   const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
//   const [tags, setTags] = useState<string[]>([]);
//   const [selectedTag, setSelectedTag] = useState<string>("All");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [sortBy, setSortBy] = useState<string>("default");

//   useEffect(() => {
//     const fetchProblems = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/gfg/problems");
//         if (!response.ok) {
//           throw new Error("Failed to fetch problems");
//         }
//         const data = await response.json();
//         setProblems(data);
//         setFilteredProblems(data);

//         // Extract unique tags from problems
//         const allTags = data
//           .filter((problem: Problem) => problem.tags && problem.tags.length > 0)
//           .flatMap((problem: Problem) => problem.tags);
//         const uniqueTags = Array.from(new Set(allTags)).sort();
//         setTags(uniqueTags);

//         setLoading(false);
//       } catch (err) {
//         setError("Error fetching problems. Please try again later.");
//         setLoading(false);
//       }
//     };

//     fetchProblems();
//   }, []);

//   useEffect(() => {
//     let updatedProblems = [...problems];

//     // Filter by selected tag
//     if (selectedTag !== "All") {
//       updatedProblems = problems.filter(
//         (problem) => problem.tags && problem.tags.includes(selectedTag)
//       );
//     }

//     // Apply sorting
//     if (sortBy === "alphabetical") {
//       updatedProblems.sort((a, b) => a.title.localeCompare(b.title));
//     } else if (sortBy === "difficulty") {
//       const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
//       updatedProblems.sort(
//         (a, b) =>
//           (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 4) -
//           (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 4)
//       );
//     }

//     setFilteredProblems(updatedProblems);
//   }, [sortBy, problems, selectedTag]);

//   const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     setSortBy(event.target.value);
//   };

//   const handleTagClick = (tag: string) => {
//     setSelectedTag(tag);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-lg text-gray-600">Loading problems...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-lg text-red-600">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={() => router.push("/")}
//                 className="text-gray-600 hover:text-green-600"
//               >
//                 <ArrowLeft className="w-6 h-6" />
//               </button>
//               <h1 className="text-2xl font-bold text-green-600">
//                 Practice Problems
//               </h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <section className="py-16 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-3xl font-bold">Coding Problems</h2>
//             <div className="flex items-center space-x-2">
//               <label
//                 htmlFor="sort"
//                 className="text-sm font-medium text-gray-700"
//               >
//                 Sort by:
//               </label>
//               <select
//                 id="sort"
//                 value={sortBy}
//                 onChange={handleSortChange}
//                 className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
//               >
//                 <option value="default">Default</option>
//                 <option value="alphabetical">A-Z</option>
//                 <option value="difficulty">Difficulty</option>
//               </select>
//             </div>
//           </div>

//           {/* Tags Tabs */}
//           <div className="mb-6 flex flex-wrap gap-2">
//             <button
//               onClick={() => handleTagClick("All")}
//               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
//                 selectedTag === "All"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//               }`}
//             >
//               All
//             </button>
//             {tags.map((tag) => (
//               <button
//                 key={tag}
//                 onClick={() => handleTagClick(tag)}
//                 className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
//                   selectedTag === tag
//                     ? "bg-green-600 text-white"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {tag}
//               </button>
//             ))}
//           </div>

//           {/* Problems List */}
//           <div className="grid grid-cols-1 gap-6">
//             {filteredProblems.length === 0 ? (
//               <p className="text-gray-600 text-center">
//                 No problems found for this tag.
//               </p>
//             ) : (
//               filteredProblems.map((problem) => (
//                 <div
//                   key={problem._id}
//                   className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg"
//                 >
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <h3 className="text-lg font-bold">{problem.title}</h3>
//                       <p className="text-gray-600 text-sm mt-1">
//                         {problem.description}
//                       </p>
//                       <p className="text-gray-500 text-sm mt-2">
//                         Difficulty: {problem.difficulty}
//                       </p>
//                       {problem.tags && problem.tags.length > 0 && (
//                         <div className="flex flex-wrap gap-2 mt-2">
//                           {problem.tags.map((tag, index) => (
//                             <span
//                               key={index}
//                               className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
//                             >
//                               {tag}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                     <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
//                       Solve Now
//                     </button>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// };

// export default PracticeProblems;




















// try 

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Footer from "../Components/Footer/page";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  tags?: string[];
}

interface PracticeProblemsProps {
  searchQuery?: string;
  searchResults?: Problem[];
}

const PracticeProblems: React.FC<PracticeProblemsProps> = ({ searchQuery = "", searchResults = [] }) => {
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("default");

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

        const allTags = data
          .filter((problem: Problem) => problem.tags && problem.tags.length > 0)
          .flatMap((problem: Problem) => problem.tags);
        const uniqueTags = Array.from(new Set(allTags)).sort();
        setTags(uniqueTags);

        setLoading(false);
      } catch (err) {
        setError("Error fetching problems. Please try again later.");
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    let updatedProblems: Problem[] = [];

    if (searchResults.length > 0) {
      updatedProblems = searchResults.filter((problem) => problem && problem._id); // Ensure valid problems
    } else if (searchQuery.trim()) {
      updatedProblems = problems.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (problem.tags &&
            problem.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    } else {
      updatedProblems = [...problems];
      if (selectedTag !== "All") {
        updatedProblems = problems.filter(
          (problem) => problem.tags && problem.tags.includes(selectedTag)
        );
      }
    }

    if (searchResults.length === 0 && !searchQuery.trim()) {
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
    }

    setFilteredProblems(updatedProblems);
  }, [sortBy, problems, selectedTag, searchQuery, searchResults]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
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
    <div className="bg-gray-50 py-16">
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

      <section className="max-w-7xl mx-auto px-4">
        {searchResults.length === 0 && !searchQuery.trim() && (
          <>
            <div className="flex justify-between items-center mb-8 mt-8">
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
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="default">Default</option>
                  <option value="alphabetical">A-Z</option>
                  <option value="difficulty">Difficulty</option>
                </select>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <button
                onClick={() => handleTagClick("All")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedTag === "All"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedTag === tag
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 gap-6">
          {filteredProblems.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-lg text-gray-600">
                No problems found for this {searchResults.length > 0 || searchQuery.trim() ? "search" : "tag"}.
              </p>
            </div>
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
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
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
      </section>

      <Footer />
    </div>
  );
};

export default PracticeProblems;