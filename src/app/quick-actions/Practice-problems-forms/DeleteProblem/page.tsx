"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
}

interface RemoveProblemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProblemDeleted: (updatedProblems: Problem[]) => void;
}

const RemoveProblemForm: React.FC<RemoveProblemFormProps> = ({
  isOpen,
  onClose,
  onProblemDeleted,
}) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblemId) {
      setError("Please select a problem to delete");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/problems/${selectedProblemId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete problem");
      }

      const updatedProblems = problems.filter(
        (problem) => problem._id !== selectedProblemId
      );
      onProblemDeleted(updatedProblems);
      setSelectedProblemId("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error deleting problem");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Remove Problem</h2>
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
                {isSubmitting ? "Deleting..." : "Delete Problem"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RemoveProblemForm;
