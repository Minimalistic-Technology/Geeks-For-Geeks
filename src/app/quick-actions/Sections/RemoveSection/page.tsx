"use client";

import React, { useState, useEffect } from "react";
import { X, FileText, Trash2 } from "lucide-react";

interface Section {
  _id: string;
  language: string;
  title: string;
}

interface RemoveDocumentationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionDeleted?: (updatedSections: Section[]) => void; // Optional callback for updating state
}

const RemoveDocumentationForm: React.FC<RemoveDocumentationFormProps> = ({
  isOpen,
  onClose,
  onSectionDeleted,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/gfg/docs");
        if (!response.ok) {
          throw new Error("Failed to fetch sections");
        }
        const data = await response.json();
        setSections(data);
      } catch (err: any) {
        setError(err.message || "Error fetching sections");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId) {
      setError("Please select a section to delete");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/docs/${selectedSectionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete section");
      }
      if (onSectionDeleted) {
        const updatedSections = sections.filter(
          (section) => section._id !== selectedSectionId
        );
        onSectionDeleted(updatedSections);
      }
      onClose();
      setSelectedSectionId("");
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error deleting section");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trash2 className="w-6 h-6 mr-2 text-red-600" />
            Remove Documentation Section
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
              Select Section to Delete
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={loading}
            >
              <option value="" disabled>
                {loading ? "Loading sections..." : "Select a section"}
              </option>
              {sections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title} ({section.language})
                </option>
              ))}
            </select>
            {error && <div className="text-red-700 text-sm mt-1">{error}</div>}
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
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={loading || !selectedSectionId}
            >
              Delete Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RemoveDocumentationForm;
