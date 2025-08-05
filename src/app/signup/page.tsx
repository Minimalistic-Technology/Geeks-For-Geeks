// "use client";

// import React, { useState } from "react";
// import { X } from "lucide-react";
// import { useRouter } from "next/navigation";

// const SignUp: React.FC = () => {
//   const router = useRouter();
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [usernameError, setUsernameError] = useState("");
//   const [emailError, setEmailError] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const validateUsername = (value: string) => {
//     if (!value) setUsernameError("Username is required.");
//     else if (!/^[a-zA-Z0-9_]+$/.test(value))
//       setUsernameError(
//         "Username should contain only letters, numbers, or underscores."
//       );
//     else setUsernameError("");
//     setUsername(value);
//   };

//   const validateSignUpEmail = (value: string) => {
//     if (!value) setEmailError("Email is required.");
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
//       setEmailError("Invalid email format.");
//     else setEmailError("");
//     setEmail(value);
//   };

//   const validateSignUpPassword = (value: string) => {
//     const strongPasswordRegex = /^[a-zA-Z]+$/;
//     if (!value) setPasswordError("Password is required.");
//     else if (!strongPasswordRegex.test(value))
//       setPasswordError(
//         "Must be 6+ chars, include upper/lowercase, number & special character."
//       );
//     else setPasswordError("");
//     setPassword(value);
//   };

//   const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     validateUsername(username);
//     validateSignUpEmail(email);
//     validateSignUpPassword(password);
//     if (
//       usernameError ||
//       emailError ||
//       passwordError ||
//       !username ||
//       !email ||
//       !password
//     ) {
//       setEmailError("Username, email, and password are required");
//       return;
//     }
//     try {
//       const response = await fetch(
//         "http://localhost:5000/api/bookstore/auth/signup",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             username,
//             email,
//             password,
//             role:
//               email === "admin@gmail.com" &&
//               password === "Admin" &&
//               username === "Admin"
//                 ? "Admin"
//                 : "User",
//           }),
//         }
//       );
//       const data = await response.json();
//       if (!response.ok) throw new Error(data.message || "Signup failed");
//       if (data.message === "User registered successfully") {
//         router.push("/login");
//       }
//     } catch (err: any) {
//       setEmailError(err.message || "Signup failed");
//       if (err.message.includes("Email already exists")) {
//         router.push("/login");
//       }
//     }
//   };

//   const handleLoginClick = () => {
//     router.push("/login");
//   };

//   return (
//     <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
//       <div className="w-full max-w-md bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-2xl p-6 relative">
//         <button
//           onClick={handleLoginClick}
//           className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//         >
//           <X className="w-6 h-6" />
//         </button>
//         <form onSubmit={handleSignUp} className="space-y-4">
//           <h1 className="text-3xl font-bold text-center text-white">
//             Create Account
//           </h1>
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => validateUsername(e.target.value)}
//             className="w-full p-3 border rounded-lg"
//           />
//           {usernameError && (
//             <p className="text-red-500 text-sm">{usernameError}</p>
//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => validateSignUpEmail(e.target.value)}
//             className="w-full p-3 border rounded-lg"
//           />
//           {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => validateSignUpPassword(e.target.value)}
//             className="w-full p-3 border rounded-lg"
//           />
//           {passwordError && (
//             <p className="text-red-500 text-sm">{passwordError}</p>
//           )}
//           <button
//             type="submit"
//             className="w-full p-3 bg-white text-black rounded-lg font-bold"
//           >
//             Create Account
//           </button>
//           <div className="text-center mt-4">
//             <button
//               type="button"
//               onClick={handleLoginClick}
//               className="text-white hover:text-emerald-200"
//             >
//               Already have an account? Log In
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;
























"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateUsername = (value: string) => {
    if (!value) setUsernameError("Username is required.");
    else if (!/^[a-zA-Z0-9_]+$/.test(value))
      setUsernameError(
        "Username should contain only letters, numbers, or underscores."
      );
    else setUsernameError("");
    setUsername(value);
  };

  const validateSignUpEmail = (value: string) => {
    if (!value) setEmailError("Email is required.");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      setEmailError("Invalid email format.");
    else setEmailError("");
    setEmail(value);
  };

  const validateSignUpPassword = (value: string) => {
    const strongPasswordRegex = /^[a-zA-Z]+$/;
    if (!value) setPasswordError("Password is required.");
    else if (!strongPasswordRegex.test(value))
      setPasswordError(
        "Must be 6+ chars, include upper/lowercase, number & special character."
      );
    else setPasswordError("");
    setPassword(value);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateUsername(username);
    validateSignUpEmail(email);
    validateSignUpPassword(password);
    if (
      usernameError ||
      emailError ||
      passwordError ||
      !username ||
      !email ||
      !password
    ) {
      setEmailError("Username, email, and password are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/gfg/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role:
            email === "admin@gmail.com" &&
            password === "Admin" &&
            username === "Admin"
              ? "Admin"
              : "User",
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      if (data._id) {
        router.push("/login");
      }
    } catch (err: any) {
      setEmailError(err.message || "Signup failed");
      if (err.message.includes("Email already exists")) {
        router.push("/login");
      }
    }
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-gradient-to-r from-green-600 to-blue-600 rounded-xl shadow-2xl p-6 relative">
        <button
          onClick={handleLoginClick}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          <X className="w-6 h-6" />
        </button>
        <form onSubmit={handleSignUp} className="space-y-4">
          <h1 className="text-3xl font-bold text-center text-white">
            Create Account
          </h1>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => validateUsername(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {usernameError && (
            <p className="text-red-500 text-sm">{usernameError}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => validateSignUpEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => validateSignUpPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-white text-black rounded-lg font-bold"
          >
            Create Account
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleLoginClick}
              className="text-white hover:text-emerald-200"
            >
              Already have an account? Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;