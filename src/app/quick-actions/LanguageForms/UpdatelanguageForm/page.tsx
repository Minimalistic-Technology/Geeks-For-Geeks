"use client";

import React, { useEffect, useState } from "react";
import { X, Edit } from "lucide-react";

interface Language {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface UpdateLanguageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageUpdated: (updatedLanguages: Language[]) => void;
  refreshNotifications?: () => void;
}

const UpdateLanguageForm: React.FC<UpdateLanguageFormProps> = ({
  isOpen,
  onClose,
  onLanguageUpdated,
  refreshNotifications,
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [updatedDetails, setUpdatedDetails] = useState<Language>({
    _id: "",
    name: "",
    icon: "",
    description: "",
  });
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
        if (data.length > 0 && !selectedLanguage) {
          setSelectedLanguage(data[0].name);
          setUpdatedDetails(data[0]); // Pre-fill with the first language's details
        }
      } catch (err: any) {
        setError(err.message || "Error fetching languages");
        setLanguages([]);
      }
    };

    if (isOpen) {
      fetchLanguages();
      setSelectedLanguage("");
      setUpdatedDetails({ _id: "", name: "", icon: "", description: "" });
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

  const handleSelectLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    setSelectedLanguage(selectedName);
    const lang = languages.find((l) => l.name === selectedName);
    if (lang) {
      setUpdatedDetails(lang);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateLanguage = async () => {
    if (!selectedLanguage) {
      setError("Please select a language to update");
      return;
    }

    const languageToUpdate = languages.find(
      (lang) => lang.name === selectedLanguage
    );
    if (!languageToUpdate) {
      setError("Selected language not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/language/${languageToUpdate._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: updatedDetails.name,
            icon: updatedDetails.icon,
            description: updatedDetails.description,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update language");
      }

      // Create notification for language update
      await createNotification(`${updatedDetails.name} language updated`);

      const updatedLanguages = languages.map((lang) =>
        lang._id === languageToUpdate._id
          ? { ...lang, ...updatedDetails }
          : lang
      );
      setLanguages(updatedLanguages);
      onLanguageUpdated(updatedLanguages);

      // Refresh notifications if callback is provided
      if (refreshNotifications) {
        refreshNotifications();
      }

      setError(null);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating language");
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Edit className="w-6 h-6 mr-2 text-green-600" />
            Update Programming Language
          </h2>
          <button
            onClick={() => {
              onClose();
              setSelectedLanguage("");
              setUpdatedDetails({
                _id: "",
                name: "",
                icon: "",
                description: "",
              });
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
              onChange={handleSelectLanguage}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={updatedDetails.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon URL
            </label>
            <input
              type="text"
              name="icon"
              value={updatedDetails.icon}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={updatedDetails.description}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 h-24"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setSelectedLanguage("");
                setUpdatedDetails({
                  _id: "",
                  name: "",
                  icon: "",
                  description: "",
                });
                setError(null);
              }}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUpdateLanguage}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              disabled={!selectedLanguage}
            >
              Update Language
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateLanguageForm;