
"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
  tags?: string[];
}

interface AddProblemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemAdded: (newProblem: Problem) => void;
  refreshNotifications?: () => void;
}

const AddProblemForm: React.FC<AddProblemFormProps> = ({
  isOpen,
  onClose,
  onProblemAdded,
  refreshNotifications,
}) => {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const createNotification = async (message: string) => {
    try {
      const userId = localStorage.getItem("userId") || "admin";
      const response = await fetch("http://localhost:5000/api/gfg/notification/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          message,
          type: "problem",
          createdBy: "admin",
          user: userId,
          isRead: false,
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to create notification: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Failed to create notification:", err);
      setError("Failed to create notification");
    }
  };

  const createSearchEntry = async (problemId: string, title: string, tags: string[]) => {
    try {
      const searchEntries = [
        { type: "problem", keyword: title, referenceId: problemId },
        ...tags.map((tag) => ({ type: "problem", keyword: tag, referenceId: problemId })),
      ];
      const response = await fetch("http://localhost:5000/api/gfg/search-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(searchEntries),
      });
     
    } catch (err) {
      console.error("Failed to create search entry:", err);
      
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/gfg/problems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ title, difficulty, description, tags }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add problem: ${response.statusText}`);
      }

      const newProblem = await response.json();
      await createSearchEntry(newProblem._id, newProblem.title, newProblem.tags || []);
      await createNotification(`${title} added`);
      onProblemAdded(newProblem);
      if (refreshNotifications) {
        refreshNotifications();
      }
      setTitle("");
      setDifficulty("Easy");
      setDescription("");
      setTags([]);
      setCurrentTag("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error adding problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add New Problem</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
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
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
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
              {isSubmitting ? "Adding..." : "Add Problem"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProblemForm;