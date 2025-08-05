"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, XCircle } from "lucide-react";
import CodeSection from "../CodeSection/page"; // assume you split CodeSection into its own file; otherwise keep inline

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Subtopic {
  name: string;
  theory: string;
  code: string;
  output: string;
  quiz: QuizQuestion[];
}

export interface Section {
  _id: string;
  language: string;
  title: string;
  theory: string;
  code: string;
  output: string;
  quiz: QuizQuestion[];
  subtopics: Subtopic[];
}

interface InteractiveDocsPageProps {
  apiUrl?: string;
  currentLanguage?: string;
}

const InteractiveDocsPage: React.FC<InteractiveDocsPageProps> = ({
  apiUrl = "http://localhost:5000/api/gfg/docs",
  currentLanguage = "Java",
}) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch documentation sections");
        }
        const data = await response.json();
        setSections(data);
      } catch (err: any) {
        setError(err.message || "Error fetching documentation sections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [apiUrl]);

  const filteredSections = sections.filter(
    (s) => s.language.toLowerCase() === currentLanguage.toLowerCase()
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-t-indigo-600 border-gray-200 rounded-full"></div>
          <p className="text-gray-600 font-medium">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
          <p className="text-lg text-gray-800 font-medium mb-2">
            Error loading documentation
          </p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            {currentLanguage} Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn {currentLanguage} programming through interactive examples,
            comprehensive theory, and hands-on quizzes. Click the arrows to
            expand each section!
          </p>
        </header>
        <main className="space-y-6">
          {filteredSections.length === 0 ? (
            <div className="min-h-[300px] flex items-center justify-center bg-white rounded-lg shadow p-8">
              <div className="text-center">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg text-gray-600">
                  No documentation sections available for {currentLanguage}.
                </p>
              </div>
            </div>
          ) : (
            filteredSections.map((section) => (
              <CodeSection key={section._id} section={section} />
            ))
          )}
        </main>
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500">
            Continue learning and practicing {currentLanguage} to master
            programming concepts!
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InteractiveDocsPage;
