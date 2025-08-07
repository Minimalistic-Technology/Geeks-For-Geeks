"use client";

import React, { useEffect, useState } from "react";
import { X, Trash2 } from "lucide-react";

interface Language {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface RemoveLanguageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageDeleted: (updatedLanguages: Language[]) => void;
  refreshNotifications?: () => void;
}

const RemoveLanguageForm: React.FC<RemoveLanguageFormProps> = ({
  isOpen,
  onClose,
  onLanguageDeleted,
  refreshNotifications,
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/language");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data = await response.json();
        setLanguages(data);
      } catch (err: any) {
        setError(err.message || "Error fetching languages");
        setLanguages([]);
      }
    };

    if (isOpen) {
      fetchLanguages();
      setSelectedLanguage("");
      setError(null);
    }
  }, [isOpen]);

  const createNotification = async (message: string) => {
    try {
      const userId = localStorage.getItem("userId") || "admin";
      const response = await fetch(
        "http://localhost:5000/api/gfg/notification/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            type: "language",
            createdBy: "admin",
            user: userId,
            isRead: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create notification");
      }
    } catch (err) {
      console.error("Failed to create notification:", err);
      setError("Failed to create notification");
    }
  };

  const handleDeleteLanguage = async () => {
    if (!selectedLanguage) {
      setError("Please select a language to delete");
      return;
    }

    const languageToDelete = languages.find(
      (lang) => lang.name === selectedLanguage
    );
    if (!languageToDelete) {
      setError("Selected language not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/language/${languageToDelete._id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete language");
      }

      // Create notification for language deletion
      await createNotification(`${languageToDelete.name} language deleted`);

      const updatedLanguages = languages.filter(
        (lang) => lang._id !== languageToDelete._id
      );
      setLanguages(updatedLanguages);
      onLanguageDeleted(updatedLanguages);

      // Refresh notifications if callback is provided
      if (refreshNotifications) {
        refreshNotifications();
      }

      setSelectedLanguage("");
      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error deleting language");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Trash2 className="w-6 h-6 mr-2 text-red-600" />
            Remove Programming Language
          </h2>
          <button
            onClick={() => {
              onClose();
              setSelectedLanguage("");
              setError(null);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="" disabled>
                Select a language
              </option>
              {languages.map((lang) => (
                <option key={lang._id} value={lang.name}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setSelectedLanguage("");
                setError(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteLanguage}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={!selectedLanguage}
            >
              Delete Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveLanguageForm;