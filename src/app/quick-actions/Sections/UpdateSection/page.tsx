"use client";

import React, { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: [string, string, string, string];
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

interface Language {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface Section {
  _id: string;
  language: string;
  title: string;
  theory: string;
  code: string;
  output: string;
  quiz: QuizQuestion[];
  subtopics: Subtopic[];
}

interface UpdateDocumentationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionUpdated?: (updatedSections: Section[]) => void;
}

const UpdateDocumentationForm: React.FC<UpdateDocumentationFormProps> = ({
  isOpen,
  onClose,
  onSectionUpdated,
}) => {
  const [formData, setFormData] = useState<Section>({
    _id: "",
    language: "",
    title: "",
    theory: "",
    code: "",
    output: "",
    quiz: [],
    subtopics: [],
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [subtopicCount, setSubtopicCount] = useState<number>(0);

  useEffect(() => {
    const fetchLanguagesAndSections = async () => {
      try {
        setLoading(true);
        setError(null);

        const langResponse = await fetch(
          "http://localhost:5000/api/gfg/language"
        );
        if (!langResponse.ok) {
          throw new Error("Failed to fetch languages");
        }
        const langData = await langResponse.json();
        setLanguages(langData);

        const sectionsResponse = await fetch(
          "http://localhost:5000/api/gfg/docs"
        );
        if (!sectionsResponse.ok) {
          throw new Error("Failed to fetch sections");
        }
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData);

        if (langData.length > 0 && sectionsData.length === 0) {
          setFormData((prev) => ({ ...prev, language: langData[0].name }));
        }
      } catch (err: any) {
        setError(err.message || "Error fetching data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLanguagesAndSections();
  }, []);

  const handleSectionSelect = (sectionId: string) => {
    const selectedSection = sections.find(
      (section) => section._id === sectionId
    );
    if (selectedSection) {
      setFormData(selectedSection);
      setSubtopicCount(selectedSection.subtopics.length);
    } else {
      setFormData({
        _id: "",
        language: languages.length > 0 ? languages[0].name : "",
        title: "",
        theory: "",
        code: "",
        output: "",
        quiz: [],
        subtopics: [],
      });
      setSubtopicCount(0);
    }
  };

  const addSubtopic = () => {
    setSubtopicCount(subtopicCount + 1);
    setFormData({
      ...formData,
      subtopics: [
        ...formData.subtopics,
        {
          name: "",
          theory: "",
          code: "",
          output: "",
          quiz: [],
        },
      ],
    });
  };

  const removeSubtopic = (index: number) => {
    setSubtopicCount(subtopicCount - 1);
    setFormData({
      ...formData,
      subtopics: formData.subtopics.filter((_, i) => i !== index),
    });
  };

  const addQuiz = (subtopicIndex?: number) => {
    if (subtopicIndex !== undefined) {
      const newSubtopics = [...formData.subtopics];
      newSubtopics[subtopicIndex].quiz.push({
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        explanation: "",
      });
      setFormData({ ...formData, subtopics: newSubtopics });
    } else {
      setFormData({
        ...formData,
        quiz: [
          ...formData.quiz,
          {
            question: "",
            options: ["", "", "", ""],
            correct: 0,
            explanation: "",
          },
        ],
      });
    }
    setError(null);
  };

  const removeQuiz = (quizIndex: number, subtopicIndex?: number) => {
    if (subtopicIndex !== undefined) {
      const newSubtopics = [...formData.subtopics];
      newSubtopics[subtopicIndex].quiz = newSubtopics[
        subtopicIndex
      ].quiz.filter((_, i) => i !== quizIndex);
      setFormData({ ...formData, subtopics: newSubtopics });
    } else {
      setFormData({
        ...formData,
        quiz: formData.quiz.filter((_, i) => i !== quizIndex),
      });
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData._id) {
      setError("Please select a section to update");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/docs/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update section");
      }
      const updatedSection = await response.json();
      if (onSectionUpdated) {
        const updatedSections = sections.map((section) =>
          section._id === updatedSection._id ? updatedSection : section
        );
        onSectionUpdated(updatedSections);
      }
      onClose();
      setFormData({
        _id: "",
        language: languages.length > 0 ? languages[0].name : "",
        title: "",
        theory: "",
        code: "",
        output: "",
        quiz: [],
        subtopics: [],
      });
      setSubtopicCount(0);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error updating section");
      console.error(err);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
    field: string,
    quizIndex?: number,
    optionIndex?: number,
    subtopicIndex?: number
  ) => {
    if (subtopicIndex !== undefined) {
      const newSubtopics = [...formData.subtopics];
      if (quizIndex !== undefined && optionIndex !== undefined) {
        newSubtopics[subtopicIndex].quiz[quizIndex].options[optionIndex] =
          e.target.value;
      } else if (quizIndex !== undefined && field.includes("quiz")) {
        newSubtopics[subtopicIndex].quiz[quizIndex][
          field.replace("quiz.", "")
        ] = e.target.value;
      } else {
        newSubtopics[subtopicIndex][field as keyof Subtopic] = e.target.value;
      }
      setFormData({ ...formData, subtopics: newSubtopics });
    } else if (quizIndex !== undefined && optionIndex !== undefined) {
      const newQuiz = [...formData.quiz];
      newQuiz[quizIndex].options[optionIndex] = e.target.value;
      setFormData({ ...formData, quiz: newQuiz });
    } else if (quizIndex !== undefined && field.includes("quiz")) {
      const newQuiz = [...formData.quiz];
      newQuiz[quizIndex][field.replace("quiz.", "")] = e.target.value;
      setFormData({ ...formData, quiz: newQuiz });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-purple-600" />
            Update Documentation Section
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Section
            </label>
            <select
              value={formData._id}
              onChange={(e) => handleSectionSelect(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Loading sections..." : "Select a section"}
              </option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title}
                </option>
              ))}
            </select>
            {error && <div className="text-red-700 text-sm mt-1">{error}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleFormChange(e, "language")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Loading languages..." : "Select a language"}
              </option>
              {languages.map((lang) => (
                <option key={lang._id} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFormChange(e, "title")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Theory
            </label>
            <textarea
              value={formData.theory}
              onChange={(e) => handleFormChange(e, "theory")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code
            </label>
            <textarea
              value={formData.code}
              onChange={(e) => handleFormChange(e, "code")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-48 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Output
            </label>
            <textarea
              value={formData.output}
              onChange={(e) => handleFormChange(e, "output")}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24"
            />
          </div>

          {/* Quiz Questions */}
          {formData.quiz.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Quiz Questions
              </h3>
              {formData.quiz.map((quiz, quizIndex) => (
                <div key={quizIndex} className="border p-4 rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-semibold text-gray-800">
                      Quiz Question {quizIndex + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeQuiz(quizIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={quiz.question}
                        onChange={(e) =>
                          handleFormChange(e, "quiz.question", quizIndex)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      />
                    </div>
                    {quiz.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Option {String.fromCharCode(65 + optionIndex)}
                        </label>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleFormChange(
                              e,
                              "quiz.options",
                              quizIndex,
                              optionIndex
                            )
                          }
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          required
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer
                      </label>
                      <select
                        value={quiz.correct}
                        onChange={(e) =>
                          handleFormChange(e, "quiz.correct", quizIndex)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        required
                      >
                        {quiz.options.map((_, index) => (
                          <option key={index} value={index}>
                            {String.fromCharCode(65 + index)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Explanation
                      </label>
                      <textarea
                        value={quiz.explanation}
                        onChange={(e) =>
                          handleFormChange(e, "quiz.explanation", quizIndex)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Subtopics */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Subtopics
            </h3>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={addSubtopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Subtopic
              </button>
              <button
                type="button"
                onClick={() => addQuiz()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Quiz
              </button>
            </div>
            {formData.subtopics.map((subtopic, subtopicIndex) => (
              <div key={subtopicIndex} className="border p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-semibold text-gray-800">
                    Subtopic {subtopicIndex + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeSubtopic(subtopicIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtopic Name
                    </label>
                    <input
                      type="text"
                      value={subtopic.name}
                      onChange={(e) =>
                        handleFormChange(
                          e,
                          "name",
                          undefined,
                          undefined,
                          subtopicIndex
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Theory
                    </label>
                    <textarea
                      value={subtopic.theory}
                      onChange={(e) =>
                        handleFormChange(
                          e,
                          "theory",
                          undefined,
                          undefined,
                          subtopicIndex
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-32"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Code
                    </label>
                    <textarea
                      value={subtopic.code}
                      onChange={(e) =>
                        handleFormChange(
                          e,
                          "code",
                          undefined,
                          undefined,
                          subtopicIndex
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-48 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Output
                    </label>
                    <textarea
                      value={subtopic.output}
                      onChange={(e) =>
                        handleFormChange(
                          e,
                          "output",
                          undefined,
                          undefined,
                          subtopicIndex
                        )
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24"
                    />
                  </div>
                  {subtopic.quiz.length > 0 && (
                    <div className="border-t pt-4">
                      <h5 className="text-md font-semibold text-gray-800 mb-4">
                        Subtopic Quiz Questions
                      </h5>
                      {subtopic.quiz.map((quiz, quizIndex) => (
                        <div
                          key={quizIndex}
                          className="border p-4 rounded-lg mb-4"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h6 className="text-sm font-semibold text-gray-800">
                              Quiz Question {quizIndex + 1}
                            </h6>
                            <button
                              type="button"
                              onClick={() =>
                                removeQuiz(quizIndex, subtopicIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question
                              </label>
                              <input
                                type="text"
                                value={quiz.question}
                                onChange={(e) =>
                                  handleFormChange(
                                    e,
                                    "quiz.question",
                                    quizIndex,
                                    undefined,
                                    subtopicIndex
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              />
                            </div>
                            {quiz.options.map((option, optionIndex) => (
                              <div key={optionIndex}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Option {String.fromCharCode(65 + optionIndex)}
                                </label>
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) =>
                                    handleFormChange(
                                      e,
                                      "quiz.options",
                                      quizIndex,
                                      optionIndex,
                                      subtopicIndex
                                    )
                                  }
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                  required
                                />
                              </div>
                            ))}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Correct Answer
                              </label>
                              <select
                                value={quiz.correct}
                                onChange={(e) =>
                                  handleFormChange(
                                    e,
                                    "quiz.correct",
                                    quizIndex,
                                    undefined,
                                    subtopicIndex
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                required
                              >
                                {quiz.options.map((_, index) => (
                                  <option key={index} value={index}>
                                    {String.fromCharCode(65 + index)}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Explanation
                              </label>
                              <textarea
                                value={quiz.explanation}
                                onChange={(e) =>
                                  handleFormChange(
                                    e,
                                    "quiz.explanation",
                                    quizIndex,
                                    undefined,
                                    subtopicIndex
                                  )
                                }
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => addQuiz(subtopicIndex)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Add Subtopic Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              disabled={!formData._id}
            >
              Update Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDocumentationForm;