// //  //  gfg 2.0

// "use client"
// import React, { useState } from "react";
// import {
//   User,
//   Edit,
//   LogOut,
//   Code,
//   Settings,
//   Shield,
//   ArrowLeft,
//   Calendar,
//   Trophy,
// } from "lucide-react";

// const Profile = () => {
//   const [username, setUsername] = useState("JohnDoe123");
//   const [problemsSolved, setProblemsSolved] = useState(47);
//   const [isEditing, setIsEditing] = useState(false);
//   const [newUsername, setNewUsername] = useState("");
//   const [error, setError] = useState("");
//   const [joinDate] = useState("January 2024");
//   const [rank, setRank] = useState("User");

//   const handleEditProfile = () => {
//     setIsEditing(true);
//     setNewUsername(username);
//   };

//   const handleSaveProfile = () => {
//     if (!newUsername || !/^[a-zA-Z0-9_]+$/.test(newUsername)) {
//       setError(
//         "Username should contain only letters, numbers, or underscores."
//       );
//       return;
//     }
//     setUsername(newUsername);
//     setIsEditing(false);
//     setError("");
//   };

//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setNewUsername(username);
//     setError("");
//   };

//   const handleLogout = () => {
//     // Logout logic here
//   };

//   const handleBackToDashboard = () => {
//     // Navigation logic here
//   };

//   return (
//     <div
//       className="min-h-screen relative overflow-hidden"
//       style={{ backgroundColor: "#FFF2E0" }}
//     >
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div
//           className="absolute top-0 left-1/4 w-72 h-72 rounded-full blur-3xl animate-pulse"
//           style={{ backgroundColor: "rgba(192, 201, 238, 0.3)" }}
//         ></div>
//         <div
//           className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000"
//           style={{ backgroundColor: "rgba(162, 170, 219, 0.2)" }}
//         ></div>
//         <div
//           className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl animate-pulse delay-500"
//           style={{ backgroundColor: "rgba(137, 138, 196, 0.15)" }}
//         ></div>
//       </div>

//       {/* Header */}
//       <header
//         className="relative z-50 backdrop-blur-xl border-b shadow-lg"
//         style={{
//           backgroundColor: "rgba(192, 201, 238, 0.8)",
//           borderColor: "rgba(162, 170, 219, 0.5)",
//         }}
//       >
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center space-x-4">
//               <button
//                 onClick={handleBackToDashboard}
//                 className="group flex items-center px-4 py-2 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border"
//                 style={{
//                   backgroundColor: "rgba(255, 242, 224, 0.8)",
//                   borderColor: "rgba(162, 170, 219, 0.3)",
//                 }}
//               >
//                 <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
//                 Back
//               </button>
//               <div
//                 className="h-6 w-px"
//                 style={{ backgroundColor: "rgba(137, 138, 196, 0.3)" }}
//               ></div>
//               <h1 className="text-2xl font-bold text-gray-800">
//                 Minimalistic Learning
//               </h1>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div
//                 className="flex items-center space-x-3 px-4 py-2 backdrop-blur-sm rounded-xl border"
//                 style={{
//                   backgroundColor: "rgba(255, 242, 224, 0.8)",
//                   borderColor: "rgba(162, 170, 219, 0.3)",
//                 }}
//               >
//                 <div
//                   className="w-8 h-8 rounded-full flex items-center justify-center"
//                   style={{ backgroundColor: "#898AC4" }}
//                 >
//                   <User className="w-4 h-4 text-white" />
//                 </div>
//                 <span className="font-small text-gray-800">{username}</span>
//               </div>
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-all duration-300"
//               >
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="relative z-10 max-w-6xl mx-auto py-8 px-6">
//         {/* Profile Hero Card */}
//         <div className="relative mb-8">
//           <div
//             className="relative backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border"
//             style={{
//               backgroundColor: "rgba(192, 201, 238, 0.6)",
//               borderColor: "rgba(162, 170, 219, 0.4)",
//             }}
//           >
//             <div className="px-8 py-8">
//               <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
//                 <div className="relative">
//                   <div
//                     className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
//                     style={{ backgroundColor: "#898AC4" }}
//                   >
//                     <User className="w-10 h-10 text-white" />
//                   </div>
//                   <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
//                 </div>
//                 <div className="text-center md:text-left">
//                   <h2 className="text-xl font-bold text-gray-800 mb-2">
//                     {username}
//                   </h2>
//                   <div className="flex items-center justify-center md:justify-start space-x-4 text-gray-700">
//                     <span
//                       className="flex items-center px-3 py-1 rounded-lg border"
//                       style={{
//                         backgroundColor: "rgba(255, 242, 224, 0.8)",
//                         borderColor: "rgba(162, 170, 219, 0.3)",
//                       }}
//                     >
//                       <Shield className="w-4 h-4 mr-2 text-purple-600" />
//                       {rank}
//                     </span>

//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Profile Settings */}
//           <div className="lg:col-span-2">
//             <div
//               className="backdrop-blur-xl rounded-2xl shadow-lg p-8 border"
//               style={{
//                 backgroundColor: "rgba(192, 201, 238, 0.6)",
//                 borderColor: "rgba(162, 170, 219, 0.4)",
//               }}
//             >
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-md font-bold text-gray-800 flex items-center">
//                   <div
//                     className="w-8 h-8 rounded-lg flex items-center justify-center mr-3"
//                     style={{ backgroundColor: "#898AC4" }}
//                   >
//                     <Settings className="w-4 h-4 text-white" />
//                   </div>
//                   Profile Settings
//                 </h3>
//                 {!isEditing && (
//                   <button
//                     onClick={handleEditProfile}
//                     className="flex items-center px-4 py-2 text-white rounded-lg transition-all duration-300 hover:shadow-md"
//                     style={{ backgroundColor: "#898AC4" }}
//                   >
//                     <Edit className="w-4 h-4 mr-2" />
//                     Edit Profile
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Username
//                   </label>
//                   {isEditing ? (
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         value={newUsername}
//                         onChange={(e) => setNewUsername(e.target.value)}
//                         className="w-full px-4 py-3 border rounded-xl transition-all duration-300 text-gray-800"
//                         placeholder="Enter your username"
//                         style={{
//                           backgroundColor: "rgba(255, 242, 224, 0.8)",
//                           borderColor: "rgba(162, 170, 219, 0.4)",
//                         }}
//                       />
//                       <div className="flex space-x-3">
//                         <button
//                           onClick={handleSaveProfile}
//                           className="px-6 py-2 bg-green-500 text-white rounded-lg transition-all duration-300 font-medium hover:bg-green-600"
//                         >
//                           Save Changes
//                         </button>
//                         <button
//                           onClick={handleCancelEdit}
//                           className="px-6 py-2 text-gray-700 rounded-lg transition-all duration-300 font-medium border"
//                           style={{
//                             backgroundColor: "rgba(255, 242, 224, 0.8)",
//                             borderColor: "rgba(162, 170, 219, 0.4)",
//                           }}
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className="px-4 py-3 rounded-xl border"
//                       style={{
//                         backgroundColor: "rgba(255, 242, 224, 0.8)",
//                         borderColor: "rgba(162, 170, 219, 0.4)",
//                       }}
//                     >
//                       <span className="text-lg font-medium text-gray-800">
//                         {username}
//                       </span>
//                     </div>
//                   )}
//                   {error && (
//                     <div className="mt-3 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
//                       <p className="text-red-700 text-sm">{error}</p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Stats Sidebar */}
//           <div className="space-y-6">
//             <div
//               className="backdrop-blur-xl rounded-2xl shadow-lg p-6 border"
//               style={{
//                 backgroundColor: "rgba(192, 201, 238, 0.6)",
//                 borderColor: "rgba(162, 170, 219, 0.4)",
//               }}
//             >
//               <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
//                 <div
//                   className="w-7 h-7 rounded-lg flex items-center justify-center mr-2"
//                   style={{ backgroundColor: "#898AC4" }}
//                 >
//                   <Trophy className="w-4 h-4 text-white" />
//                 </div>
//                 Your Stats
//               </h3>
//               <div className="space-y-4">
//                 <div
//                   className="p-4 rounded-xl border"
//                   style={{
//                     backgroundColor: "rgba(255, 242, 224, 0.8)",
//                     borderColor: "rgba(162, 170, 219, 0.4)",
//                   }}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-gray-700 font-medium text-sm">
//                       Problems Solved
//                     </p>
//                     <Code className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <p className="text-2xl font-bold text-gray-800">
//                     {problemsSolved}
//                   </p>
//                 </div>

//                 <div
//                   className="p-4 rounded-xl border"
//                   style={{
//                     backgroundColor: "rgba(255, 242, 224, 0.8)",
//                     borderColor: "rgba(162, 170, 219, 0.4)",
//                   }}
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <p className="text-gray-700 font-medium text-sm">
//                       Current Role
//                     </p>
//                     <Shield className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <p className="text-xl font-bold text-gray-800">{rank}</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>
//       </main>

//     </div>
//   );
// };

// export default Profile;

//
"use client";
import React, { useState } from "react";
import {
  User,
  Edit,
  LogOut,
  Code,
  Settings,
  Shield,
  ArrowLeft,
  Calendar,
  Trophy,
} from "lucide-react";

const Profile = () => {
  const [username, setUsername] = useState("JohnDoe123");
  const [problemsSolved, setProblemsSolved] = useState(47);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [joinDate] = useState("January 2024");
  const [rank, setRank] = useState("User");

  const handleEditProfile = () => {
    setIsEditing(true);
    setNewUsername(username);
  };

  const handleSaveProfile = () => {
    if (!newUsername || !/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError(
        "Username should contain only letters, numbers, or underscores."
      );
      return;
    }
    setUsername(newUsername);
    setIsEditing(false);
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername(username);
    setError("");
  };

  const handleLogout = () => {
    // Logout logic here
  };

  const handleBackToDashboard = () => {
    // Navigation logic here
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF2E0" }}>
      {/* Modern Header with Gradient */}
      <header className="relative">
        <div
          className="h-22"
          style={{
            background:
              "linear-gradient(135deg, #898AC4 0%, #A2AADB 50%, #C0C9EE 100%)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToDashboard}
                  className="flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:bg-white/30"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <h1 className="text-2xl font-bold text-white ml-4">
                  Minimalistic Learning
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500/80 backdrop-blur-sm text-white rounded-full transition-all duration-300 hover:bg-red-500"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Profile Avatar Section - Overlapping Header */}
        <div className="relative -mt-16 z-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-white"
                  style={{ backgroundColor: "#898AC4" }}
                >
                  <User className="w-16 h-16 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {username}
              </h2>
              <div className="flex items-center space-x-4">
                <span
                  className="px-4 py-2 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: "#C0C9EE",
                    color: "#898AC4",
                  }}
                >
                  <Shield className="w-4 h-4 mr-2 inline" />
                  {rank}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto py-12 px-6">
        {/* Horizontal Layout */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div
              className="rounded-3xl shadow-lg p-6 border-0"
              style={{
                backgroundColor: "#C0C9EE",
                boxShadow: "0 10px 40px rgba(137, 138, 196, 0.3)",
              }}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
                Your Stats
              </h3>

              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#898AC4" }}
                  >
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-lg font-bold text-gray-800">
                    {problemsSolved}
                  </p>
                  <p className="text-sm text-gray-600">Problems Solved</p>
                </div>

                <hr style={{ borderColor: "rgba(137, 138, 196, 0.3)" }} />

                <div className="text-center">
                  <div
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: "#A2AADB" }}
                  >
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-md font-bold text-gray-800">{rank}</p>
                  <p className="text-sm text-gray-600">Role</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings Card */}
            <div
              className="rounded-3xl shadow-lg p-8 border-0"
              style={{
                backgroundColor: "white",
                boxShadow: "0 20px 60px rgba(162, 170, 219, 0.2)",
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mr-4"
                    style={{ backgroundColor: "#898AC4" }}
                  >
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Profile Settings
                  </h3>
                </div>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center px-6 py-3 text-white rounded-2xl transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                    style={{ backgroundColor: "#898AC4" }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Username Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-4">
                    Username
                  </label>
                  {isEditing ? (
                    <div className="space-y-6">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-6 py-4 border-2 rounded-2xl transition-all duration-300 text-lg focus:outline-none focus:ring-4"
                        placeholder="Enter your username"
                        style={{
                          backgroundColor: "#FFF2E0",
                          borderColor: "#C0C9EE",
                          focusRingColor: "rgba(162, 170, 219, 0.3)",
                        }}
                      />
                      <div className="flex space-x-4">
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 px-8 py-4 bg-green-500 text-white rounded-2xl transition-all duration-300 font-semibold hover:bg-green-600 transform hover:scale-105"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-8 py-4 text-gray-700 rounded-2xl transition-all duration-300 font-semibold border-2 hover:shadow-md"
                          style={{
                            backgroundColor: "#FFF2E0",
                            borderColor: "#C0C9EE",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="px-6 py-4 rounded-2xl border-2"
                      style={{
                        backgroundColor: "#FFF2E0",
                        borderColor: "#C0C9EE",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-md font-semibold text-gray-800">
                          {username}
                        </span>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: "#898AC4" }}
                        >
                          <User className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-2xl">
                      <p className="text-red-700 font-medium">{error}</p>
                    </div>
                  )}
                </div>


                  <div
                    className="p-6 rounded-2xl border-2"
                    style={{
                      backgroundColor: "#898AC4",
                      borderColor: "rgba(162, 170, 219, 0.3)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-semibold mb-1">
                          Account Status
                        </p>
                        <p className="text-lg font-bold text-white">Active</p>
                      </div>
                      <Shield className="w-8 h-8 text-white opacity-80" />
                    </div>
                  </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
