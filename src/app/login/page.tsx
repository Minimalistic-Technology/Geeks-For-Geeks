

// "use client";

// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { useRouter } from "next/navigation";
// import jwt from "jsonwebtoken"; // Corrected import

// const Login: React.FC = () => {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const validateEmail = (value: string) => {
//     if (!value) setError("Email is required.");
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
//       setError("Invalid email format.");
//     else setError("");
//     setEmail(value);
//   };

//   const validatePassword = (value: string) => {
//     if (!value) setError("Password is required.");
//     else setError("");
//     setPassword(value);
//   };

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     validateEmail(email);
//     validatePassword(password);
//     if (error || !email || !password) {
//       setError("Email and password are required");
//       return;
//     }
//     // Dynamically set role based on email
//     const role = email === "admin@gmail.com" ? "Admin" : "User";
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/bookstore/auth/login",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password, role }),
//         }
//       );
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed");
//       }
//       const data = await response.json();
//       if (data.token) {
//         localStorage.setItem("accessToken", data.token);
//         const decodedToken = jwt.decode(data.token) as { role?: string };
//         const isAdmin = decodedToken?.role === "Admin";
//         localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
//         router.push(isAdmin ? "/Admin-dashboard" : "/Dashboard");
//       }
//       localStorage.setItem("token", data.token); 
//     } catch (err: any) {
//       setError(err.message || "Failed to fetch login data");
//     }
//   };

//   const handleSignUpClick = () => {
//     router.push("/signup");
//   };

//   return (
//     <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//       <div className="w-full max-w-md bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-2xl p-8 relative">
//         <button
//           onClick={() => router.push("/Dashboard")}
//           className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//         >
//           <X className="w-6 h-6" />
//         </button>
//         <form onSubmit={handleLogin} className="space-y-6">
//           <h1 className="text-3xl font-bold text-center text-white">Login</h1>
//           <div>
//             <label className="block text-sm text-white mb-1">Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => validateEmail(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//             {error && <p className="text-red-500 text-sm">{error}</p>}
//           </div>
//           <div>
//             <label className="block text-sm text-white mb-1">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => validatePassword(e.target.value)}
//               className="w-full p-3 border rounded-lg"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full p-3 bg-white text-black rounded-lg font-bold"
//           >
//             Login
//           </button>
//           <div className="text-center mt-4">
//             <button
//               type="button"
//               onClick={handleSignUpClick}
//               className="text-white font-medium hover:text-emerald-200"
//             >
//               Don’t have an account? Sign Up
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;































"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    if (!value) setError("Email is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      setError("Invalid email format.");
    else setError("");
    setEmail(value);
  };

  const validatePassword = (value: string) => {
    if (!value) setError("Password is required.");
    else setError("");
    setPassword(value);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateEmail(email);
    validatePassword(password);
    console.log("Validation check", { email, password, error });
    if (error || !email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/gfg/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error data", errorData);
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      console.log("Response data", data);
      if (data._id) {
        // Simulate authentication using user _id instead of token
        localStorage.setItem("accessToken", data._id); // Use _id as a pseudo-token
        localStorage.setItem("userId", data._id);
        localStorage.setItem(
          "isAdmin",
          data.role === "Admin" ? "true" : "false"
        );
        router.push(data.role === "Admin" ? "/Admin-dashboard" : "/Dashboard");
      } else {
        console.log("No user data received", data);
        setError("Login failed: No user data received");
      }
    } catch (err: any) {
      console.error("Login error", err);
      setError(err.message || "Failed to fetch login data");
    }
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-2xl p-8 relative">
        <button
          onClick={() => router.push("/Dashboard")}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
        <form onSubmit={handleLogin} className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-white">Login</h1>
          <div>
            <label className="block text-sm text-white mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div>
            <label className="block text-sm text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => validatePassword(e.target.value)}
              className="w-full p-3 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-white text-black rounded-lg font-bold"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleSignUpClick}
              className="text-white font-medium hover:text-emerald-200"
            >
              Don’t have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;