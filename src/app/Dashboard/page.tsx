// "use client";

// import React, { useState, useEffect } from "react";
// import { Search, Menu, X, Bell, User } from "lucide-react";
// import { useRouter } from "next/navigation";
// import Footer from "../Components/Footer/page";
// import Languages from "../Components/Languages_tabs/page";
// import DashboardStats from "../Components/DashboardStats/page"; 

// const Dashboard: React.FC = () => {
//   const router = useRouter();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token"); // or use cookies/session
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleSignIn = () => {
//     router.push("/login");
//   };

//   const handlePracticeProblems = () => {
//     router.push("/Practice-problems");
//   };

//   const handleProfileClick = () => {
//     router.push("/user-profile");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-3">
//               <img
//                 src="/learning-logo.png"
//                 alt="Minimalistic Technology Logo"
//                 className="w-8 h-8 object-contain"
//               />
//               <h1 className="text-2xl font-bold text-green-600">
//                 Minimalistic Learning
//               </h1>
//             </div>
//             <div className="hidden md:block flex-1 max-w-lg mx-8">
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
//                   placeholder="Search languages, problems..."
//                 />
//               </div>
//             </div>
//             <nav className="hidden md:flex space-x-8">
//               <a
//                 href="/Practice-problems"
//                 className="text-gray-500 hover:text-green-600"
//               >
//                 Practice
//               </a>
//               <a
//                 href="/compiler"
//                 className="text-gray-500 hover:text-green-600"
//               >
//                 Compiler
//               </a>
//             </nav>
//             <div className="flex items-center space-x-4">
//               <Bell className="w-6 h-6 text-gray-600 hover:text-green-600" />
//               {isLoggedIn ? (
//                 <User
//                   className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer"
//                   onClick={handleProfileClick}
//                 />
//               ) : (
//                 <button
//                   onClick={handleSignIn}
//                   className="text-gray-600 hover:text-green-600 font-medium"
//                 >
//                   Sign In
//                 </button>
//               )}
//               <button
//                 className="md:hidden p-2"
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               >
//                 {isMobileMenuOpen ? <X /> : <Menu />}
//               </button>
//             </div>
//           </div>
//         </div>
//         {isMobileMenuOpen && (
//           <div className="md:hidden bg-white border-t px-4 pt-2 pb-4">
//             <a
//               href="#"
//               onClick={handlePracticeProblems}
//               className="block text-gray-600 py-2"
//             >
//               Practice
//             </a>
//             <a href="/compiler" className="block text-gray-600 py-2">
//               Compiler
//             </a>
//           </div>
//         )}
//       </header>

//       {/* Hero */}
//       <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 text-center">
//         <h1 className="text-5xl font-bold mb-4">Learn. Code. Compete.</h1>
//         <p className="text-xl mb-8">
//           Master programming with problems, contests and coding languages
//         </p>
//         <div className="flex gap-4 justify-center">
//           <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
//             Start Coding
//           </button>
//           <button
//             onClick={handlePracticeProblems}
//             className="border cursor-pointer border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600"
//           >
//             Practice Problems
//           </button>
//         </div>
//       </section>

//       {/* Stats */}
//       <DashboardStats />

//       <Languages />
//       <Footer />
//     </div>
//   );
// };

// export default Dashboard;


















// 
"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, X, Bell, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Footer from "../Components/Footer/page";
import Languages from "../Components/Languages_tabs/page";
import DashboardStats from "../Components/DashboardStats/page";
import PracticeProblems from "../Practice-problems/page";

interface SearchResult {
  type: "language" | "problem";
  data: any;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSignIn = () => {
    router.push("/login");
  };

  const handlePracticeProblems = () => {
    router.push("/Practice-problems");
  };

  const handleProfileClick = () => {
    router.push("/user-profile");
  };

  const handleSearchKeyDown = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setSearchError(null);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      setSearchError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/gfg/find?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        if (response.status === 404) {
          // Handle 404 as "no results" instead of an error
          setSearchResults([]);
          setSearchError("No matches found for your search.");
        } else if (!response.ok) {
          throw new Error(`Search failed: ${response.statusText}`);
        } else {
          const data = await response.json();
          const results = Array.isArray(data) ? data : [data];
          setSearchResults(results.filter((r: SearchResult) => r.data)); // Filter out null data
          if (
            results.length === 0 ||
            results.every((r: SearchResult) => !r.data)
          ) {
            setSearchError("No matches found for your search.");
          }
        }
      } catch (err: any) {
        console.error("Search error:", err);
        setSearchError("Failed to perform search. Showing local results.");
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/learning-logo.png"
                alt="Minimalistic Technology Logo"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-green-600">
                Minimalistic Learning
              </h1>
            </div>
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Search languages, problems, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="/Practice-problems"
                className="text-gray-500 hover:text-green-600"
              >
                Practice
              </a>
              <a
                href="/compiler"
                className="text-gray-500 hover:text-green-600"
              >
                Compiler
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-600 hover:text-green-600" />
              {isLoggedIn ? (
                <User
                  className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer"
                  onClick={handleProfileClick}
                />
              ) : (
                <button
                  onClick={handleSignIn}
                  className="text-gray-600 hover:text-green-600 font-medium"
                >
                  Sign In
                </button>
              )}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 pt-2 pb-4">
            <a
              href="#"
              onClick={handlePracticeProblems}
              className="block text-gray-600 py-2"
            >
              Practice
            </a>
            <a href="/compiler" className="block text-gray-600 py-2">
              Compiler
            </a>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Search languages, problems, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Learn. Code. Compete.</h1>
        <p className="text-xl mb-8">
          Master programming with problems, contests, and coding languages
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Coding
          </button>
          <button
            onClick={handlePracticeProblems}
            className="border cursor-pointer border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600"
          >
            Practice Problems
          </button>
        </div>
      </section>

      {/* Stats */}
      <DashboardStats />

      {/* Search feedback */}
      {isSearching && (
        <div className="text-center py-8 bg-white shadow-md rounded-lg mx-4">
          <p className="text-lg text-gray-600">Searching...</p>
        </div>
      )}
      {searchError && (
        <div className="text-center py-8 bg-white shadow-md rounded-lg mx-4">
          <p className="text-lg text-red-600">{searchError}</p>
        </div>
      )}

      <PracticeProblems
        searchQuery={searchQuery}
        searchResults={searchResults
          .filter((result) => result.type === "problem")
          .map((result) => result.data)}
      />
      <Languages
        searchQuery={searchQuery}
        searchResults={searchResults
          .filter((result) => result.type === "language")
          .map((result) => result.data)}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;