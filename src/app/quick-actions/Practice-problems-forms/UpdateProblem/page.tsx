"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  tags?: string[];
}

interface UpdateProblemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemUpdated: (updatedProblems: Problem[]) => void;
}

const UpdateProblemForm: React.FC<UpdateProblemFormProps> = ({
  isOpen,
  onClose,
  onProblemUpdated,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || "Error fetching problems");
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchProblems();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedProblemId) {
      const selectedProblem = problems.find(
        (problem) => problem._id === selectedProblemId
      );
      if (selectedProblem) {
        setTitle(selectedProblem.title);
        setDifficulty(selectedProblem.difficulty);
        setDescription(selectedProblem.description);
        setTags(selectedProblem.tags || []);
      }
    } else {
      setTitle("");
      setDifficulty("Easy");
      setDescription("");
      setTags([]);
    }
  }, [selectedProblemId, problems]);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId) {
      setError("Please select a problem to update");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/problems/${selectedProblemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, difficulty, description, tags }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update problem");
      }

      const updatedProblem = await response.json();
      const updatedProblems = problems.map((problem) =>
        problem._id === selectedProblemId ? updatedProblem : problem
      );
      onProblemUpdated(updatedProblems);
      setSelectedProblemId("");
      setTitle("");
      setDifficulty("Easy");
      setDescription("");
      setTags([]);
      setCurrentTag("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        {isLoading ? (
          <p className="text-gray-600">Loading problems...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-gray-700"
              >
                Select Problem
              </label>
              <select
                id="problem"
                value={selectedProblemId}
                onChange={(e) => setSelectedProblemId(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="">Select a problem</option>
                {problems.map((problem) => (
                  <option key={problem._id} value={problem._id}>
                    {problem.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700"
              >
                Difficulty
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-red-500 focus:border-red-500"
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 p-2 w-full border rounded-lg focus:ring-red-500 focus:border-red-500"
                rows={4}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700"
              >
                Tags
              </label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-red-600 hover:text-red-800"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  className="flex-1 p-2 border rounded-lg focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Add
                </button>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400"
              >
                {isSubmitting ? "Updating..." : "Update Problem"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateProblemForm;