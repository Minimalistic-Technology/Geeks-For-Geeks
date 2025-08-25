// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Play,
//   Download,
//   Copy,
//   Settings,
//   Code,
//   Terminal,
//   ChevronDown,
// } from "lucide-react";

// interface JudgePanelProps {
//   code: string;
//   language: string; // or a union type if you want specific languages
// }

// // Mock JudgePanel component
// const JudgePanel: React.FC<JudgePanelProps> = ({ code, language }) => {
//   return (
//     <div className="space-y-2">
//       <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
//         Code Analysis
//       </h3>
//       <div className="text-xs text-gray-500 dark:text-gray-400">
//         Language: {language} | Lines: {code.split("\n").length} | Characters:{" "}
//         {code.length}
//       </div>
//     </div>
//   );
// };

// // Define the union type for language keys
// type LanguageKey = "javascript" | "python" | "java" | "cpp" | "c" | "php";

// // Define the Language interface
// interface Language {
//   name: string;
//   defaultCode: string;
//   icon: string;
//   judge0Id: number;
// }

// const MultiLanguageCompiler: React.FC = () => {
//   const [selectedLanguage, setSelectedLanguage] =
//     useState<LanguageKey>("python");
//   const [code, setCode] = useState<string>("");
//   const [originalCode, setOriginalCode] = useState<string>(""); // Store original code during input
//   const [output, setOutput] = useState<string>("");
//   const [isRunning, setIsRunning] = useState<boolean>(false);
//   const [theme, setTheme] = useState<"dark" | "light">("dark");
//   const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
//   const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);

//   const languages: Record<LanguageKey, Language> = {
//     javascript: {
//       name: "JavaScript",
//       defaultCode: `// JavaScript Example
// console.log("Hello, World!");

// function fibonacci(n) {
//     if (n <= 1) return n;
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }

// console.log("Fibonacci of 10:", fibonacci(10));`,
//       icon: "🟨",
//       judge0Id: 63, // Node.js
//     },
//     python: {
//       name: "Python",
//       defaultCode: `# Python Example
// print("Hello, World!")

// def fibonacci(n):
//     if n <= 1:
//         return n
//     return fibonacci(n - 1) + fibonacci(n - 2)

// print(f"Fibonacci of 10: {fibonacci(10)}")`,
//       icon: "🐍",
//       judge0Id: 71, // Python 3
//     },
//     java: {
//       name: "Java",
//       defaultCode: `// Java Example
// public class Main {
//     public static void main(String[] args) {
//         System.out.println("Hello, World!");
//         System.out.println("Fibonacci of 10: " + fibonacci(10));
//     }
    
//     public static int fibonacci(int n) {
//         if (n <= 1) return n;
//         return fibonacci(n - 1) + fibonacci(n - 2);
//     }
// }`,
//       icon: "☕",
//       judge0Id: 62,
//     },
//     cpp: {
//       name: "C++",
//       defaultCode: `// C++ Example
// #include <iostream>
// using namespace std;

// int fibonacci(int n) {
//     if (n <= 1) return n;
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }

// int main() {
//     cout << "Hello, World!" << endl;
//     cout << "Fibonacci of 10: " << fibonacci(10) << endl;
//     return 0;
// }`,
//       icon: "⚡",
//       judge0Id: 54, // C++17
//     },
//     c: {
//       name: "C",
//       defaultCode: `// C Example
// #include <stdio.h>

// int fibonacci(int n) {
//     if (n <= 1) return n;
//     return fibonacci(n - 1) + fibonacci(n - 2);
// }

// int main() {
//     printf("Hello, World!\\n");
//     printf("Fibonacci of 10: %d\\n", fibonacci(10));
//     return 0;
// }`,
//       icon: "🔧",
//       judge0Id: 50,
//     },
//     php: {
//       name: "PHP",
//       defaultCode: `<?php
// // PHP Example
// echo "Hello, World!\\n";

// function fibonacci($n) {
//     if ($n <= 1) return $n;
//     return fibonacci($n - 1) + fibonacci($n - 2);
// }

// echo "Fibonacci of 10: " . fibonacci(10) . "\\n";
// ?>`,
//       icon: "🐘",
//       judge0Id: 68,
//     },
//   };

//   const handleLanguageChange = (lang: React.SetStateAction<LanguageKey>) => {
//     const newLang: LanguageKey =
//       typeof lang === "function" ? lang(selectedLanguage) : lang;
//     if (newLang in languages) {
//       setSelectedLanguage(newLang);
//       setCode(languages[newLang].defaultCode);
//       setOriginalCode(languages[newLang].defaultCode);
//       setOutput("");
//       setIsAwaitingInput(false);
//       setIsDropdownOpen(false);
//     } else {
//       console.warn(`Language ${newLang} not supported`);
//     }
//   };

//   const executeJavaScript = (
//     code: string
//   ): { success: boolean; output: string } => {
//     try {
//       const originalLog = console.log;
//       const originalError = console.error;
//       const originalWarn = console.warn;
//       let output = "";

//       console.log = (...args: any[]) => {
//         output +=
//           args
//             .map((arg) =>
//               typeof arg === "object"
//                 ? JSON.stringify(arg, null, 2)
//                 : String(arg)
//             )
//             .join(" ") + "\n";
//       };
//       console.error = (...args: any[]) => {
//         output += "ERROR: " + args.map((arg) => String(arg)).join(" ") + "\n";
//       };
//       console.warn = (...args: any[]) => {
//         output += "WARNING: " + args.map((arg) => String(arg)).join(" ") + "\n";
//       };

//       const result = eval(code);

//       if (result !== undefined && output === "") {
//         output = String(result) + "\n";
//       }

//       console.log = originalLog;
//       console.error = originalError;
//       console.warn = originalWarn;

//       return {
//         success: true,
//         output: output || "Code executed successfully (no output)",
//       };
//     } catch (error: any) {
//       console.log = console.log;
//       console.error = console.error;
//       console.warn = console.warn;
//       return { success: false, output: `Error: ${error.message}` };
//     }
//   };

//   // Helper function to safely encode strings with Unicode characters for btoa
//   const safeBase64Encode = (str: string): string => {
//     try {
//       return btoa(unescape(encodeURIComponent(str)));
//     } catch (error: any) {
//       console.error("Base64 encoding error:", error);
//       throw new Error("Failed to encode input: contains invalid characters");
//     }
//   };

//   // Helper function to check if code requires input
//   const requiresInput = (code: string, language: LanguageKey): boolean => {
//     const inputPatterns: Record<LanguageKey, RegExp> = {
//       c: /scanf\s*\(/,
//       cpp: /cin\s*>>/,
//       python: /input\s*\(/,
//       java: /Scanner\s*\.\s*next/,
//       php: /fgets\s*\(\s*STDIN/,
//       javascript: /prompt\s*\(/,
//     };
//     return inputPatterns[language]?.test(code) || false;
//   };

//   const handleOutputKeyPress = async (
//     e: React.KeyboardEvent<HTMLTextAreaElement>
//   ) => {
//     if (e.key === "Enter" && isAwaitingInput && !e.shiftKey && !e.ctrlKey) {
//       e.preventDefault(); // Prevent new line in textarea
//       setIsRunning(true);
//       setIsAwaitingInput(false);

//       try {
//         // Extract user input (after "User Input:")
//         const userInput: string = output.replace("User Input:", "").trim();
//         console.log("Submitted stdin:", userInput); // Debugging log

//         // Judge0 API integration
//         const apiHost: string = "judge0-ce.p.rapidapi.com";
//         const apiKey: string =
//           "164d12aed7msh478523551d9d103p13947cjsna587409e4bbc";
//         const submissionUrl: string = `https://${apiHost}/submissions?base64_encoded=true`;

//         // Preprocess Java code to rename public class to Main
//         let processedCode: string = originalCode;
//         if (selectedLanguage === "java") {
//           processedCode = originalCode.replace(
//             /public\s+class\s+\w+\s*{/,
//             "public class Main {"
//           );
//         }

//         // Encode code and stdin safely
//         const encodedCode: string = safeBase64Encode(processedCode);
//         const encodedStdin: string = safeBase64Encode(userInput);

//         // Submit code to Judge0
//         const submissionResponse: Response = await fetch(submissionUrl, {
//           method: "POST",
//           headers: {
//             "X-RapidAPI-Host": apiHost,
//             "X-RapidAPI-Key": apiKey,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             source_code: encodedCode,
//             language_id: languages[selectedLanguage].judge0Id,
//             stdin: encodedStdin,
//           }),
//         });

//         if (!submissionResponse.ok) {
//           throw new Error(
//             `Submission failed: ${submissionResponse.statusText}`
//           );
//         }

//         const { token }: { token: string } = await submissionResponse.json();

//         // Poll for results (increased to 20 seconds)
//         let result: any;
//         let attempts: number = 0;
//         const maxAttempts: number = 20; // Increased from 10
//         const pollInterval: number = 1000; // 1 second

//         while (attempts < maxAttempts) {
//           await new Promise((resolve) => setTimeout(resolve, pollInterval));
//           const resultResponse: Response = await fetch(
//             `https://${apiHost}/submissions/${token}?base64_encoded=true`,
//             {
//               method: "GET",
//               headers: {
//                 "X-RapidAPI-Host": apiHost,
//                 "X-RapidAPI-Key": apiKey,
//               },
//             }
//           );

//           if (!resultResponse.ok) {
//             throw new Error(
//               `Failed to fetch result: ${resultResponse.statusText}`
//             );
//           }

//           result = await resultResponse.json();

//           // Status ID 3 = Accepted, 4 = Wrong Answer, >4 = Various errors
//           if (result.status.id >= 3) {
//             break;
//           }

//           attempts++;
//         }

//         if (!result || result.status.id === undefined) {
//           throw new Error("Failed to retrieve execution result");
//         }

//         // Decode outputs
//         const stdout: string = result.stdout ? atob(result.stdout) : "";
//         const stderr: string = result.stderr ? atob(result.stderr) : "";
//         const compileOutput: string = result.compile_output
//           ? atob(result.compile_output)
//           : "";
//         const message: string = result.message ? atob(result.message) : "";

//         // Build output, including only core output components
//         let finalOutput: string = "";
//         if (compileOutput) {
//           finalOutput += `${compileOutput}\n`;
//         }
//         if (stderr) {
//           finalOutput += `${stderr}\n`;
//         }
//         if (stdout) {
//           finalOutput += `${stdout}\n`;
//         }
//         if (message) {
//           finalOutput += `${message}\n`;
//         }

//         setOutput(finalOutput.trim() || "No output produced");
//       } catch (error: any) {
//         setOutput(`Error: ${error.message}`);
//         setIsAwaitingInput(false);
//       } finally {
//         setIsRunning(false);
//       }
//     }
//   };

//   const executeCode = async () => {
//     if (!code.trim()) {
//       setOutput("Error: No code to execute");
//       return;
//     }

//     setIsRunning(true);
//     setOutput(""); // Clear output initially

//     try {
//       // Check if code requires input
//       if (requiresInput(code, selectedLanguage)) {
//         setOriginalCode(code); // Save original code
//         setOutput("User Input:"); // Set initial prompt with "User Input:"
//         setIsAwaitingInput(true);
//         setIsRunning(false);
//         return;
//       }

//       // Use client-side execution for JavaScript (optional: can switch to Judge0)
//       if (selectedLanguage === "javascript" && false) {
//         // Set to true to use Judge0 for JS
//         const result = executeJavaScript(code);
//         setOutput(result.output);
//         setIsRunning(false);
//         return;
//       }

//       // Judge0 API integration
//       const apiHost: string = "judge0-ce.p.rapidapi.com";
//       const apiKey: string =
//         "164d12aed7msh478523551d9d103p13947cjsna587409e4bbc";
//       const submissionUrl: string = `https://${apiHost}/submissions?base64_encoded=true`;

//       // Preprocess Java code to rename public class to Main
//       let processedCode: string = code;
//       if (selectedLanguage === "java") {
//         processedCode = code.replace(
//           /public\s+class\s+\w+\s*{/,
//           "public class Main {"
//         );
//       }

//       // Encode code and stdin safely
//       const encodedCode: string = safeBase64Encode(processedCode);
//       const encodedStdin: string = safeBase64Encode(""); // No input for non-input programs

//       // Submit code to Judge0
//       const submissionResponse: Response = await fetch(submissionUrl, {
//         method: "POST",
//         headers: {
//           "X-RapidAPI-Host": apiHost,
//           "X-RapidAPI-Key": apiKey,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           source_code: encodedCode,
//           language_id: languages[selectedLanguage].judge0Id,
//           stdin: encodedStdin,
//         }),
//       });

//       if (!submissionResponse.ok) {
//         throw new Error(`Submission failed: ${submissionResponse.statusText}`);
//       }

//       const { token }: { token: string } = await submissionResponse.json();

//       // Poll for results
//       let result: any;
//       let attempts: number = 0;
//       const maxAttempts: number = 10;
//       const pollInterval: number = 1000; // 1 second

//       while (attempts < maxAttempts) {
//         await new Promise((resolve) => setTimeout(resolve, pollInterval));
//         const resultResponse: Response = await fetch(
//           `https://${apiHost}/submissions/${token}?base64_encoded=true`,
//           {
//             method: "GET",
//             headers: {
//               "X-RapidAPI-Host": apiHost,
//               "X-RapidAPI-Key": apiKey,
//             },
//           }
//         );

//         if (!resultResponse.ok) {
//           throw new Error(
//             `Failed to fetch result: ${resultResponse.statusText}`
//           );
//         }

//         result = await resultResponse.json();

//         // Status ID 3 = Accepted, 4 = Wrong Answer, >4 = Various errors
//         if (result.status.id >= 3) {
//           break;
//         }

//         attempts++;
//       }

//       if (!result || result.status.id === undefined) {
//         throw new Error("Failed to retrieve execution result");
//       }

//       // Decode outputs
//       const stdout: string = result.stdout ? atob(result.stdout) : "";
//       const stderr: string = result.stderr ? atob(result.stderr) : "";
//       const compileOutput: string = result.compile_output
//         ? atob(result.compile_output)
//         : "";
//       const message: string = result.message ? atob(result.message) : "";

//       // Build output, including only core output components
//       let finalOutput: string = "";
//       if (compileOutput) {
//         finalOutput += `${compileOutput}\n`;
//       }
//       if (stderr) {
//         finalOutput += `${stderr}\n`;
//       }
//       if (stdout) {
//         finalOutput += `${stdout}\n`;
//       }
//       if (message) {
//         finalOutput += `${message}\n`;
//       }

//       setOutput(finalOutput.trim() || "No output produced");
//     } catch (error: any) {
//       setOutput(`Error: ${error.message}`);
//       setIsAwaitingInput(false);
//     } finally {
//       setIsRunning(false);
//     }
//   };

//   const copyCode = () => {
//     navigator.clipboard.writeText(code);
//   };

//   const downloadCode = () => {
//     const fileExtensions: Record<LanguageKey, string> = {
//       javascript: "js",
//       python: "py",
//       java: "java",
//       cpp: "cpp",
//       c: "c",
//       php: "php",
//     };

//     const blob = new Blob([code], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `code.${fileExtensions[selectedLanguage]}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   useEffect(() => {
//     if (selectedLanguage in languages) {
//       setCode(languages[selectedLanguage].defaultCode);
//       setOriginalCode(languages[selectedLanguage].defaultCode);
//       setOutput("");
//       setIsAwaitingInput(false);
//     } else {
//       setSelectedLanguage("python");
//       setCode(languages.python.defaultCode);
//       setOriginalCode(languages.python.defaultCode);
//       setOutput("");
//       setIsAwaitingInput(false);
//     }
//   }, [selectedLanguage]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const dropdown = document.getElementById("language-dropdown");
//       if (dropdown && !dropdown.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       className={`min-h-screen ${
//         theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
//       } transition-colors duration-200`}
//     >
//       {/* Header */}
//       <div
//         className={`${
//           theme === "dark"
//             ? "bg-gray-800 border-gray-700"
//             : "bg-white border-gray-200"
//         } border-b px-6 py-4`}
//       >
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <div className="flex items-center space-x-2">
//               <Code className="w-8 h-8 text-blue-500" />
//               <h1 className="text-2xl font-bold">GeeksHub Compiler</h1>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span
//                 className={`text-sm ${
//                   theme === "dark" ? "text-gray-400" : "text-gray-500"
//                 }`}
//               >
//                 Multi-Language Support
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <button
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//               className={`p-2 rounded-md ${
//                 theme === "dark"
//                   ? "bg-gray-700 hover:bg-gray-600"
//                   : "bg-gray-200 hover:bg-gray-300"
//               } transition-colors`}
//             >
//               <Settings className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col h-[calc(100vh-80px)]">
//         {/* Toolbar with Language Dropdown */}
//         <div
//           className={`${
//             theme === "dark"
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-200"
//           } border-b p-4`}
//         >
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               {/* Language Dropdown */}
//               <div className="relative" id="language-dropdown">
//                 <button
//                   onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                   className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all ${
//                     theme === "dark"
//                       ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
//                       : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
//                   } min-w-[180px] justify-between`}
//                 >
//                   <div className="flex items-center space-x-2">
//                     <span className="text-xl">
//                       {languages[selectedLanguage].icon}
//                     </span>
//                     <span className="font-medium">
//                       {languages[selectedLanguage].name}
//                     </span>
//                   </div>
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${
//                       isDropdownOpen ? "transform rotate-180" : ""
//                     }`}
//                   />
//                 </button>

//                 {isDropdownOpen && (
//                   <div
//                     className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-lg border z-50 ${
//                       theme === "dark"
//                         ? "bg-gray-700 border-gray-600"
//                         : "bg-white border-gray-200"
//                     }`}
//                   >
//                     {Object.entries(languages).map(([key, lang]) => (
//                       <button
//                         key={key}
//                         onClick={() => handleLanguageChange(key)}
//                         className={`w-full flex items-center space-x-3 p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
//                           selectedLanguage === key
//                             ? "bg-blue-600 text-white"
//                             : theme === "dark"
//                             ? "hover:bg-gray-600 text-gray-300"
//                             : "hover:bg-gray-100 text-gray-700"
//                         }`}
//                       >
//                         <span className="text-xl">{lang.icon}</span>
//                         <span className="font-medium">{lang.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={copyCode}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
//                   theme === "dark"
//                     ? "bg-gray-700 hover:bg-gray-600 text-white"
//                     : "bg-gray-200 hover:bg-gray-300 text-gray-800"
//                 }`}
//               >
//                 <Copy className="w-5 h-5" />
//                 <span>Copy</span>
//               </button>
//               <button
//                 onClick={downloadCode}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
//                   theme === "dark"
//                     ? "bg-gray-700 hover:bg-gray-600 text-white"
//                     : "bg-gray-200 hover:bg-gray-300 text-gray-800"
//                 }`}
//               >
//                 <Download className="w-5 h-5" />
//                 <span>Download</span>
//               </button>
//               <button
//                 onClick={executeCode}
//                 disabled={isRunning || isAwaitingInput} // Added isAwaitingInput to disable during input mode
//                 className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
//                   isRunning || isAwaitingInput
//                     ? "bg-gray-500 cursor-not-allowed"
//                     : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
//                 }`}
//               >
//                 <Play
//                   className={`w-5 h-5 ${isRunning ? "animate-spin" : ""}`}
//                 />
//                 <span>{isRunning ? "Running..." : "Run Code"}</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Code Editor and Output */}
//         <div className="flex-1 flex">
//           {/* Code Editor */}
//           <div className="flex-1 flex flex-col">
//             <div
//               className={`${
//                 theme === "dark"
//                   ? "bg-gray-700 border-gray-600"
//                   : "bg-gray-100 border-gray-200"
//               } px-4 py-2 text-sm font-medium border-b`}
//             >
//               Code Editor
//             </div>
//             <textarea
//               value={code}
//               onChange={(e) => setCode(e.target.value)}
//               className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
//                 theme === "dark"
//                   ? "bg-gray-900 text-white border-gray-600"
//                   : "bg-white text-gray-800 border-gray-200"
//               } border-r`}
//               placeholder="Write your code here..."
//               spellCheck="false"
//             />
//           </div>

//           {/* Output Panel */}
//           <div className="w-1/3 flex flex-col">
//             <div
//               className={`${
//                 theme === "dark"
//                   ? "bg-gray-700 border-gray-600"
//                   : "bg-gray-100 border-gray-200"
//               } px-4 py-2 text-sm font-medium border-b flex items-center space-x-2`}
//             >
//               <Terminal className="w-4 h-4" />
//               <span>Output</span>
//             </div>
//             <textarea
//               value={output}
//               onChange={(e) => isAwaitingInput && setOutput(e.target.value)}
//               onKeyDown={handleOutputKeyPress}
//               readOnly={!isAwaitingInput}
//               className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
//                 theme === "dark"
//                   ? "bg-black text-green-400"
//                   : "bg-gray-50 text-gray-800"
//               } whitespace-pre-wrap overflow-auto`}
//               placeholder={
//                 isAwaitingInput
//                   ? "Enter input here (one line per value or space-separated)..."
//                   : "Click 'Run Code' to see output here..."
//               }
//               spellCheck="false"
//             />
//           </div>
//         </div>

//         {/* Judge Panel */}
//         <div
//           className={`${
//             theme === "dark"
//               ? "bg-gray-800 border-gray-700"
//               : "bg-white border-gray-200"
//           } border-t p-4`}
//         >
//           <JudgePanel code={code} language={languages[selectedLanguage].name} />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MultiLanguageCompiler;























// try
"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  Download,
  Copy,
  Settings,
  Code,
  Terminal,
  ChevronDown,
} from "lucide-react";

interface JudgePanelProps {
  code: string;
  language: string;
}

// Mock JudgePanel component
const JudgePanel: React.FC<JudgePanelProps> = ({ code, language }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
        Code Analysis
      </h3>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Language: {language} | Lines: {code.split("\n").length} | Characters:{" "}
        {code.length}
      </div>
    </div>
  );
};

// Define the union type for language keys
type LanguageKey = "javascript" | "python" | "java" | "cpp" | "c" | "php";

// Define the Language interface
interface Language {
  name: string;
  defaultCode: string;
  icon: string;
  judge0Id: number;
  printPattern: RegExp;
  inputPattern: RegExp;
}

const MultiLanguageCompiler: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageKey>("python");
  const [code, setCode] = useState<string>("");
  const [originalCode, setOriginalCode] = useState<string>(""); // Store original code during input
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAwaitingInput, setIsAwaitingInput] = useState<boolean>(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [userInputs, setUserInputs] = useState<string[]>([]); // Store inputs for stdin
  const [inputStartPos, setInputStartPos] = useState<number>(0); // Track start of user-typed input
  const [allPromptsText, setAllPromptsText] = useState<string>(""); // NEW: Combined prompts for single input mode

  const languages: Record<LanguageKey, Language> = {
    javascript: {
      name: "JavaScript",
      defaultCode: `// JavaScript Example
console.log("Hello, World!");

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 10:", fibonacci(10));`,
      icon: "🟨",
      judge0Id: 63,
      printPattern: /console\.log\s*\(/,
      inputPattern: /prompt\s*\(/,
    },
    python: {
      name: "Python",
      defaultCode: `# Python Example
print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(f"Fibonacci of 10: {fibonacci(10)}")`,
      icon: "🐍",
      judge0Id: 71,
      printPattern: /print\s*\(/,
      inputPattern: /input\s*\(/,
    },
    java: {
      name: "Java",
      defaultCode: `// Java Example
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        System.out.println("Fibonacci of 10: " + fibonacci(10));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
      icon: "☕",
      judge0Id: 62,
      printPattern: /System\.out\.println\s*\(/,
      inputPattern: /Scanner\s*\.\s*next/,
    },
    cpp: {
      name: "C++",
      defaultCode: `// C++ Example
#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "Fibonacci of 10: " << fibonacci(10) << endl;
    return 0;
}`,
      icon: "⚡",
      judge0Id: 54,
      printPattern: /cout\s*<</,
      inputPattern: /cin\s*>>/,
    },
    c: {
      name: "C",
      defaultCode: `// C Example
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Hello, World!\\n");
    printf("Fibonacci of 10: %d\\n", fibonacci(10));
    return 0;
}`,
      icon: "🔧",
      judge0Id: 50,
      printPattern: /printf\s*\(/,
      inputPattern: /scanf\s*\(/,
    },
    php: {
      name: "PHP",
      defaultCode: `<?php
// PHP Example
echo "Hello, World!\\n";

function fibonacci($n) {
    if ($n <= 1) return $n;
    return fibonacci($n - 1) + fibonacci($n - 2);
}

echo "Fibonacci of 10: " . fibonacci(10) . "\\n";
?>`,
      icon: "🐘",
      judge0Id: 68,
      printPattern: /echo\s/,
      inputPattern: /fgets\s*\(\s*STDIN/,
    },
  };

  const handleLanguageChange = (lang: React.SetStateAction<LanguageKey>) => {
    const newLang: LanguageKey =
      typeof lang === "function" ? lang(selectedLanguage) : lang;
    if (newLang in languages) {
      setSelectedLanguage(newLang);
      setCode(languages[newLang].defaultCode);
      setOriginalCode(languages[newLang].defaultCode);
      setOutput("");
      setIsAwaitingInput(false);
      setIsDropdownOpen(false);
      setPrompts([]);
      setUserInputs([]);
      setAllPromptsText("");
    } else {
      console.warn(`Language ${newLang} not supported`);
    }
  };

  const executeJavaScript = (
    code: string
  ): { success: boolean; output: string } => {
    try {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      let output = "";

      console.log = (...args: any[]) => {
        output +=
          args
            .map((arg) =>
              typeof arg === "object"
                ? JSON.stringify(arg, null, 2)
                : String(arg)
            )
            .join(" ") + "\n";
      };
      console.error = (...args: any[]) => {
        output += "ERROR: " + args.map((arg) => String(arg)).join(" ") + "\n";
      };
      console.warn = (...args: any[]) => {
        output += "WARNING: " + args.map((arg) => String(arg)).join(" ") + "\n";
      };

      const result = eval(code);

      if (result !== undefined && output === "") {
        output = String(result) + "\n";
      }

      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      return {
        success: true,
        output: output || "Code executed successfully (no output)",
      };
    } catch (error: any) {
      console.log = console.log;
      console.error = console.error;
      console.warn = console.warn;
      return { success: false, output: `Error: ${error.message}` };
    }
  };

  // Helper function to safely encode strings with Unicode characters for btoa
  const safeBase64Encode = (str: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (error: any) {
      console.error("Base64 encoding error:", error);
      throw new Error("Failed to encode input: contains invalid characters");
    }
  };

  // Helper function to check if code requires input
  const requiresInput = (code: string, language: LanguageKey): boolean => {
    return languages[language].inputPattern.test(code);
  };

  // Helper function to extract all print statements that look like input prompts (containing "enter")
  const extractPrintStatements = (
    code: string,
    language: LanguageKey
  ): string[] => {
    const lines = code.split("\n");
    const printStatements: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (languages[language].printPattern.test(line)) {
        let match = null;
        // Language-specific string extraction
        if (language === "c") {
          match = line.match(/printf\s*\(["'](.*?)["']\s*,?/);
        } else if (language === "cpp") {
          match = line.match(/cout\s*<<\s*["'](.*?)["']\s*(?:<<.*)?/);
        } else if (language === "python") {
          match = line.match(/print\s*\(["'](.*?)["']\s*,?/);
        } else if (language === "java") {
          match = line.match(/System\.out\.println\s*\(["'](.*?)["']\s*\)/);
        } else if (language === "php") {
          match = line.match(/echo\s*["'](.*?)["']\s*;/);
        } else if (language === "javascript") {
          match = line.match(/console\.log\s*\(["'](.*?)["']\s*\)/);
        }
        if (match && match[1] && match[1].toLowerCase().includes("enter")) {
          printStatements.push(match[1].replace(/\\n/, "\n"));
        }
      }
    }
    return printStatements.length > 0 ? printStatements : [""];
  };

  const handleOutputKeyPress = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && isAwaitingInput && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      setIsRunning(true);

      const currentInput = output.substring(inputStartPos).trim();
      if (!currentInput) {
        setIsRunning(false);
        return; // Prevent submission if no input provided
      }

      // NEW: Since we use single mode, we only have one input collection
      setUserInputs([currentInput]);

      setIsAwaitingInput(false);
      try {
        const userInput = currentInput;
        console.log("Submitted stdin:", userInput);

        const apiHost: string = "judge0-ce.p.rapidapi.com";
        const apiKey: string =
          "164d12aed7msh478523551d9d103p13947cjsna587409e4bbc";
        const submissionUrl: string = `https://${apiHost}/submissions?base64_encoded=true`;

        let processedCode: string = originalCode;
        if (selectedLanguage === "java") {
          processedCode = originalCode.replace(
            /public\s+class\s+\w+\s*{/,
            "public class Main {"
          );
        }

        const encodedCode: string = safeBase64Encode(processedCode);
        const encodedStdin: string = safeBase64Encode(userInput);

        const submissionResponse: Response = await fetch(submissionUrl, {
          method: "POST",
          headers: {
            "X-RapidAPI-Host": apiHost,
            "X-RapidAPI-Key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source_code: encodedCode,
            language_id: languages[selectedLanguage].judge0Id,
            stdin: encodedStdin,
          }),
        });

        if (!submissionResponse.ok) {
          throw new Error(
            `Submission failed: ${submissionResponse.statusText}`
          );
        }

        const { token }: { token: string } = await submissionResponse.json();

        let result: any;
        let attempts: number = 0;
        const maxAttempts: number = 20;
        const pollInterval: number = 1000;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, pollInterval));
          const resultResponse: Response = await fetch(
            `https://${apiHost}/submissions/${token}?base64_encoded=true`,
            {
              method: "GET",
              headers: {
                "X-RapidAPI-Host": apiHost,
                "X-RapidAPI-Key": apiKey,
              },
            }
          );

          if (!resultResponse.ok) {
            throw new Error(
              `Failed to fetch result: ${resultResponse.statusText}`
            );
          }

          result = await resultResponse.json();

          if (result.status.id >= 3) {
            break;
          }

          attempts++;
        }

        if (!result || result.status.id === undefined) {
          throw new Error("Failed to retrieve execution result");
        }

        const stdout: string = result.stdout ? atob(result.stdout) : "";
        const stderr: string = result.stderr ? atob(result.stderr) : "";
        const compileOutput: string = result.compile_output
          ? atob(result.compile_output)
          : "";
        const message: string = result.message ? atob(result.message) : "";

        let finalOutput: string = "";
        if (compileOutput) finalOutput += `${compileOutput}\n`;
        if (stderr) finalOutput += `${stderr}\n`;
        if (stdout) finalOutput += `${stdout}\n`;
        if (message) finalOutput += `${message}\n`;

        setOutput(finalOutput.trim() || "No output produced");
      } catch (error: any) {
        setOutput(`Error: ${error.message}`);
      } finally {
        setIsRunning(false);
        setPrompts([]);
        setUserInputs([]);
        setInputStartPos(0);
        setAllPromptsText("");
      }
    }
  };

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput("Error: No code to execute");
      return;
    }

    setIsRunning(true);
    setOutput("");

    try {
      if (requiresInput(code, selectedLanguage)) {
        setOriginalCode(code);
        let extractedPrompts = extractPrintStatements(code, selectedLanguage);
        if (extractedPrompts.length > 0) {
          setPrompts(extractedPrompts);
          // NEW: Combine all prompts into one text block, replacing %d in subsequent prompts (assume first input is n for %d)
          // But since we can't know n yet, we show generic prompts and let user enter all at once
          const combined = extractedPrompts
            .map((p, index) => {
              if (index > 0 && p.includes("%d")) {
                return p.replace("%d", "[number of elements]"); // Placeholder to guide user
              }
              return p;
            })
            .join("\n");
          setAllPromptsText(combined);
          setOutput(combined);
          setInputStartPos(combined.length);
          setIsAwaitingInput(true);
        } else {
          setOutput("No print statements found for prompts.");
          setIsAwaitingInput(false);
        }
        setIsRunning(false);
        return;
      }

      if (selectedLanguage === "javascript" && false) {
        const result = executeJavaScript(code);
        setOutput(result.output);
        setIsRunning(false);
        return;
      }

      const apiHost: string = "judge0-ce.p.rapidapi.com";
      const apiKey: string =
        "164d12aed7msh478523551d9d103p13947cjsna587409e4bbc";
      const submissionUrl: string = `https://${apiHost}/submissions?base64_encoded=true`;

      let processedCode: string = code;
      if (selectedLanguage === "java") {
        processedCode = code.replace(
          /public\s+class\s+\w+\s*{/,
          "public class Main {"
        );
      }

      const encodedCode: string = safeBase64Encode(processedCode);
      const encodedStdin: string = safeBase64Encode("");

      const submissionResponse: Response = await fetch(submissionUrl, {
        method: "POST",
        headers: {
          "X-RapidAPI-Host": apiHost,
          "X-RapidAPI-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source_code: encodedCode,
          language_id: languages[selectedLanguage].judge0Id,
          stdin: encodedStdin,
        }),
      });

      if (!submissionResponse.ok) {
        throw new Error(`Submission failed: ${submissionResponse.statusText}`);
      }

      const { token }: { token: string } = await submissionResponse.json();

      let result: any;
      let attempts: number = 0;
      const maxAttempts: number = 10;
      const pollInterval: number = 1000;

      while (attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, pollInterval));
        const resultResponse: Response = await fetch(
          `https://${apiHost}/submissions/${token}?base64_encoded=true`,
          {
            method: "GET",
            headers: {
              "X-RapidAPI-Host": apiHost,
              "X-RapidAPI-Key": apiKey,
            },
          }
        );

        if (!resultResponse.ok) {
          throw new Error(
            `Failed to fetch result: ${resultResponse.statusText}`
          );
        }

        result = await resultResponse.json();

        if (result.status.id >= 3) {
          break;
        }

        attempts++;
      }

      if (!result || result.status.id === undefined) {
        throw new Error("Failed to retrieve execution result");
      }

      const stdout: string = result.stdout ? atob(result.stdout) : "";
      const stderr: string = result.stderr ? atob(result.stderr) : "";
      const compileOutput: string = result.compile_output
        ? atob(result.compile_output)
        : "";
      const message: string = result.message ? atob(result.message) : "";

      let finalOutput: string = "";
      if (compileOutput) finalOutput += `${compileOutput}\n`;
      if (stderr) finalOutput += `${stderr}\n`;
      if (stdout) finalOutput += `${stdout}\n`;
      if (message) finalOutput += `${message}\n`;

      setOutput(finalOutput.trim() || "No output produced");
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
      setIsAwaitingInput(false);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const downloadCode = () => {
    const fileExtensions: Record<LanguageKey, string> = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      php: "php",
    };

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${fileExtensions[selectedLanguage]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (selectedLanguage in languages) {
      setCode(languages[selectedLanguage].defaultCode);
      setOriginalCode(languages[selectedLanguage].defaultCode);
      setOutput("");
      setIsAwaitingInput(false);
      setPrompts([]);
      setUserInputs([]);
      setAllPromptsText("");
    } else {
      setSelectedLanguage("python");
      setCode(languages.python.defaultCode);
      setOriginalCode(languages.python.defaultCode);
      setOutput("");
      setIsAwaitingInput(false);
      setPrompts([]);
      setUserInputs([]);
      setAllPromptsText("");
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("language-dropdown");
      if (dropdown && !dropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-200`}
    >
      {/* Header */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b px-6 py-4`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Code className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">GeeksHub Compiler</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                Multi-Language Support
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className={`p-2 rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-80px)]">
        {/* Toolbar with Language Dropdown */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-b p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Language Dropdown */}
              <div className="relative" id="language-dropdown">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg border transition-all ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
                      : "bg-white hover:bg-gray-50 border-gray-300 text-gray-800"
                  } min-w-[180px] justify-between`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">
                      {languages[selectedLanguage].icon}
                    </span>
                    <span className="font-medium">
                      {languages[selectedLanguage].name}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isDropdownOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-lg border z-50 ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {Object.entries(languages).map(([key, lang]) => (
                      <button
                        key={key}
                        onClick={() => handleLanguageChange(key)}
                        className={`w-full flex items-center space-x-3 p-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          selectedLanguage === key
                            ? "bg-blue-600 text-white"
                            : theme === "dark"
                            ? "hover:bg-gray-600 text-gray-300"
                            : "hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        <span className="text-xl">{lang.icon}</span>
                        <span className="font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={copyCode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <Copy className="w-5 h-5" />
                <span>Copy</span>
              </button>
              <button
                onClick={downloadCode}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
              <button
                onClick={executeCode}
                disabled={isRunning || isAwaitingInput}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  isRunning || isAwaitingInput
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                <Play
                  className={`w-5 h-5 ${isRunning ? "animate-spin" : ""}`}
                />
                <span>{isRunning ? "Running..." : "Run Code"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Code Editor and Output */}
        <div className="flex-1 flex">
          {/* Code Editor */}
          <div className="flex-1 flex flex-col">
            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-200"
              } px-4 py-2 text-sm font-medium border-b`}
            >
              Code Editor
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                theme === "dark"
                  ? "bg-gray-900 text-white border-gray-600"
                  : "bg-white text-gray-800 border-gray-200"
              } border-r`}
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <div className="w-1/3 flex flex-col">
            <div
              className={`${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-100 border-gray-200"
              } px-4 py-2 text-sm font-medium border-b flex items-center space-x-2`}
            >
              <Terminal className="w-4 h-4" />
              <span>Output</span>
            </div>
            <textarea
              value={output}
              onChange={(e) => isAwaitingInput && setOutput(e.target.value)}
              onKeyDown={handleOutputKeyPress}
              readOnly={!isAwaitingInput}
              className={`flex-1 p-4 font-mono text-sm resize-none focus:outline-none ${
                theme === "dark"
                  ? "bg-black text-green-400"
                  : "bg-gray-50 text-gray-800"
              } whitespace-pre-wrap overflow-auto`}
              placeholder={
                isAwaitingInput
                  ? "Enter all inputs here (use Shift+Enter for new lines, Enter to submit)..."
                  : "Click 'Run Code' to see output here..."
              }
              spellCheck="false"
            />
          </div>
        </div>

        {/* Judge Panel */}
        <div
          className={`${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border-t p-4`}
        >
          <JudgePanel code={code} language={languages[selectedLanguage].name} />
        </div>
      </div>
    </div>
  );
};

export default MultiLanguageCompiler;