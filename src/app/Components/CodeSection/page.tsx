"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  BookOpen,
  HelpCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Layers,
} from "lucide-react";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Subtopic {
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

// Quiz Component
const Quiz = ({
  questions,
  sectionTitle,
  subtopic,
}: {
  questions: QuizQuestion[];
  sectionTitle: string;
  subtopic?: string;
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers, selectedAnswer];
      setAnswers(newAnswers);
      if (selectedAnswer === questions[currentQuestion].correct) {
        setScore((s) => s + 1);
      }
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((i) => i + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  if (showResult) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200 max-h-96 overflow-y-auto">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h3>
          <p className="text-lg text-gray-600 mb-4">
            Your Score:{" "}
            <span className="font-bold text-indigo-600">
              {score} / {questions.length}
            </span>
          </p>
          <div className="space-y-3 mb-6 max-h-48 overflow-y-auto">
            {questions.map((q, index) => (
              <div
                key={index}
                className="text-left bg-white rounded-lg p-4 border"
              >
                <p className="font-medium text-gray-800 mb-2">{q.question}</p>
                <div className="flex items-center gap-2">
                  {answers[index] === q.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-600">
                    Your answer: {q.options[answers[index]]}
                  </span>
                </div>
                <p className="text-sm text-blue-600 mt-1">{q.explanation}</p>
              </div>
            ))}
          </div>
          <button
            onClick={resetQuiz}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  return (
    <div className="rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-800">
          {subtopic ? `${subtopic} Quiz` : `${sectionTitle} Quiz`}
        </h3>
        <span className="ml-auto text-sm text-indigo-600 font-medium">
          {currentQuestion + 1} / {questions.length}
        </span>
      </div>
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
        <p className="text-gray-800 font-medium mb-4">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedAnswer === index
                  ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
              }`}
            >
              <span className="font-medium mr-2">
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {currentQuestion < questions.length - 1
          ? "Next Question"
          : "Finish Quiz"}
      </button>
    </div>
  );
};

// OutputDisplay Component
const OutputDisplay = ({ output }: { output: string }) => {
  return (
    <div className="mt-4 bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-sm font-semibold text-gray-300">Output:</h2>
      </div>
      <pre className="text-sm font-mono leading-relaxed">{output}</pre>
    </div>
  );
};

// CodeBox Component
const CodeBox = ({ code, language }: { code: string; language: string }) => {
  const syntaxHighlight = (code: string) => {
    const keywords = [
      "public",
      "class",
      "static",
      "void",
      "String",
      "return",
      "int",
      "boolean",
      "if",
      "else",
      "for",
      "while",
      "new",
    ];
    const strings = /(".*?")/g;
    const comments = /(\/\/.*)|(\/\*[\s\S]*?\*\/)/g;
    let highlighted = code;

    highlighted = highlighted.replace(
      comments,
      '<span style="color: #6b7280; font-style: italic;">$1$2</span>'
    );

    highlighted = highlighted.replace(
      strings,
      '<span style="color: #10b981;">$1</span>'
    );

    keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #60a5fa; font-weight: 600;">${keyword}</span>`
      );
    });

    return highlighted;
  };

  return (
    <div>
      <div className="bg-gray-800 rounded-t-lg p-3 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-gray-400 text-sm ml-2">
              {language === "" ? "Main.java" : `${language}.java`}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 rounded-b-lg overflow-hidden">
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            <code
              className="text-gray-100"
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(code),
              }}
            />
          </pre>
        </div>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <p className="text-sm text-blue-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          View the code example and see the output below.
        </p>
      </div>
    </div>
  );
};

// Subtopics Dropdown Component
const SubtopicsDropdown = ({
  subtopics,
  isOpen,
  onSubtopicSelect,
}: {
  subtopics: Subtopic[];
  isOpen: boolean;
  onSubtopicSelect: (name: string) => void;
}) => {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="mt-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-black" />
          <h3 className="text-sm font-semibold text-black">
            What you'll learn:
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subtopics.map((subtopic, index) => (
            <div
              key={index}
              onClick={() => onSubtopicSelect(subtopic.name)}
              className="group bg-white bg-opacity-10 hover:bg-opacity-20 rounded-lg transition-all duration-200 cursor-pointer border border-white border-opacity-20 hover:border-opacity-40"
            >
              <div className="flex items-start gap-2 p-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-black group-hover:text-blue-600 transition-colors">
                    {subtopic.name}
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// CodeSection Component
const CodeSection: React.FC<{ section: Section }> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"theory" | "code" | "quiz">(
    "theory"
  );
  const [showSubtopics, setShowSubtopics] = useState(false);
  const [activeSubtopic, setActiveSubtopic] = useState<string | null>(null);
  const theoryRef = useRef<HTMLDivElement | null>(null);

  const theory = activeSubtopic
    ? section.subtopics.find((s) => s.name === activeSubtopic)?.theory ||
      section.theory
    : section.theory;

  const questions = activeSubtopic
    ? section.subtopics.find((s) => s.name === activeSubtopic)?.quiz ||
      section.quiz
    : section.quiz;

  const activeSubtopicData = activeSubtopic
    ? section.subtopics.find((s) => s.name === activeSubtopic) || null
    : null;

  const handleSubtopicSelect = (subtopicName: string) => {
    setActiveSubtopic(subtopicName);
    setActiveTab("theory");
    setTimeout(() => {
      if (theoryRef.current) {
        theoryRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 0);
  };

  const toggleExpanded = () => {
    setIsExpanded((e) => !e);
    if (!isExpanded) {
      setActiveTab("theory");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
        <div className="relative z-10 flex items-center justify-between h-full gap-4">
          <div className="w-6" />
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-bold text-white inline-block">
              {section.title}
            </h2>
            {!isExpanded && (
              <p className="text-blue-100 text-sm mt-2">
                Click arrow to expand and explore
              </p>
            )}
            {isExpanded && (
              <div className="mt-2 flex justify-center">
                <button
                  onClick={() => setShowSubtopics((s) => !s)}
                  className="text-blue-100 text-sm hover:text-blue-200 transition-colors flex items-center gap-1 font-medium"
                >
                  <span className="hidden md:inline">Explore Subtopics</span>
                  {showSubtopics ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={toggleExpanded}
              className="ml-4 p-2 rounded-full transition-all duration-200"
            >
              {isExpanded ? (
                <ChevronUp className="w-6 h-6 text-white" />
              ) : (
                <ChevronDown className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2 text-center">
            <SubtopicsDropdown
              subtopics={section.subtopics}
              isOpen={showSubtopics}
              onSubtopicSelect={handleSubtopicSelect}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="border-b border-gray-200">
          <nav className="flex justify-center">
            <button
              onClick={() => setActiveTab("theory")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "theory"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Theory
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "code"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Play className="w-4 h-4" />
              View Code
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 ${
                activeTab === "quiz"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Quiz
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "theory" && (
            <div
              ref={(el) => (theoryRef.current = el)}
              className="prose max-w-none"
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {activeSubtopic || section.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {theory}
                </p>
              </div>
            </div>
          )}
          {activeTab === "code" && (
            <>
              {activeSubtopicData ? (
                <div>
                  <CodeBox
                    code={activeSubtopicData.code}
                    language={section.language}
                  />
                  <OutputDisplay output={activeSubtopicData.output} />
                </div>
              ) : (
                <div>
                  <CodeBox code={section.code} language={section.language} />
                  <OutputDisplay output={section.output} />
                </div>
              )}
            </>
          )}
          {activeTab === "quiz" && questions && questions.length > 0 && (
            <Quiz
              questions={questions}
              sectionTitle={section.title}
              subtopic={activeSubtopic || undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeSection;