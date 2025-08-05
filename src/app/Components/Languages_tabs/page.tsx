// // og

// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// interface Language {
//   _id: string;
//   name: string;
//   icon: string;
//   description: string;
// }

// const Languages: React.FC = () => {
//   const [activeTab, setActiveTab] = useState("languages");
//   const [languages, setLanguages] = useState<Language[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchLanguages = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/gfg/language");
//         if (!response.ok) {
//           throw new Error("Failed to fetch languages");
//         }
//         const data = await response.json();
//         setLanguages(data);
//       } catch (err: any) {
//         setError(err.message || "Error fetching languages");
//         console.error(err);
//       }
//     };

//     fetchLanguages();
//   }, []);

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex space-x-2 mb-8">
//           <button
//             className="px-4 py-2 rounded-md font-medium bg-white shadow text-gray-900"
//             onClick={() => setActiveTab("languages")}
//           >
//             Languages
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
//             {error}
//           </div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//           {languages.map((lang) => (
//             <div
//               key={lang._id}
//               className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-3 hover:shadow-lg"
//             >
//               <div className="flex items-center space-x-4">
//                 <img src={lang.icon} alt={lang.name} className="w-12 h-12" />
//                 <div>
//                   <h3 className="text-lg font-bold">{lang.name}</h3>
//                   <p className="text-gray-600 text-sm">{lang.description}</p>
//                 </div>
//               </div>
//               <div className="mt-4 flex space-x-2 self-end">
//                 <button
//                   className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   // try
//                   onClick={() =>
//                     router.push(`../documentation/${lang.name.toLowerCase()}`)
//                   }
//                 >
//                   Learn More
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//                   onClick={() =>
//                     lang.name
//                       ? router.push("./compiler")
//                       : alert("Failed to load compiler page for " + lang.name)
//                   }
//                 >
//                   Code Now
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Languages;

















 
// try

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Language {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface LanguagesProps {
  searchQuery?: string;
  searchResults?: Language[];
}

const Languages: React.FC<LanguagesProps> = ({
  searchQuery = "",
  searchResults = [],
}) => {
  const [activeTab, setActiveTab] = useState("languages");
  const [languages, setLanguages] = useState<Language[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<Language[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/language");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data = await response.json();
        setLanguages(data);
        setFilteredLanguages(data);
      } catch (err: any) {
        setError(err.message || "Error fetching languages");
        console.error(err);
      }
    };

    fetchLanguages();
  }, []);

  useEffect(() => {
    if (searchResults.length > 0) {
      setFilteredLanguages(searchResults.filter((lang) => lang && lang._id)); // Ensure valid languages
    } else if (searchQuery.trim()) {
      const filtered = languages.filter((lang) =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLanguages(filtered);
    } else {
      setFilteredLanguages(languages);
    }
  }, [searchQuery, languages, searchResults]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {searchResults.length === 0 && !searchQuery.trim() && (
          <div className="flex space-x-2 mb-8">
            <button
              className="px-4 py-2 rounded-md font-medium bg-white shadow text-gray-900"
              onClick={() => setActiveTab("languages")}
            >
              Languages
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredLanguages.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <p className="text-lg text-gray-600">
                No languages found for this search.
              </p>
            </div>
          ) : (
            filteredLanguages.map((lang) => (
              <div
                key={lang._id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-3 hover:shadow-lg"
              >
                <div className="flex items-center space-x-4">
                  <img src={lang.icon} alt={lang.name} className="w-12 h-12" />
                  <div>
                    <h3 className="text-lg font-bold">{lang.name}</h3>
                    <p className="text-gray-600 text-sm">{lang.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2 self-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() =>
                      router.push(`../documentation/${lang.name.toLowerCase()}`)
                    }
                  >
                    Learn More
                  </button>
                  <button
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() =>
                      lang.name
                        ? router.push("./compiler")
                        : alert("Failed to load compiler page for " + lang.name)
                    }
                  >
                    Code Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Languages;