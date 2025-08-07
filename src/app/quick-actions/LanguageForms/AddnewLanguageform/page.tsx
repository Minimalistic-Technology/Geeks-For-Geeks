"use client";

import React, { useState } from "react";
import { X, Code2 } from "lucide-react";

interface AddNewLanguageFormProps {
  isOpen: boolean;
  onClose: () => void;
  refreshNotifications?: () => void;
}

const AddNewLanguageForm: React.FC<AddNewLanguageFormProps> = ({
  isOpen,
  onClose,
  refreshNotifications,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    description: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("http://localhost:5000/api/gfg/language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add language");
      }

      // Create notification for language addition
      await createNotification(`${formData.name} language added`);

      setSuccess("Language added successfully!");

      // Refresh notifications if callback is provided
      if (refreshNotifications) {
        refreshNotifications();
      }

      setFormData({
        name: "",
        icon: "",
        description: "",
      });

      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 1500); // Close after showing success message
    } catch (err: any) {
      setError(err.message || "Error adding language. Please try again.");
      console.error(err);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Code2 className="w-6 h-6 mr-2 text-blue-600" />
            Add New Programming Language
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg">
              {success}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon URL
            </label>
            <input
              type="url"
              name="icon"
              value={formData.icon}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://cdn.example.com/icon.svg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
              required
            />
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Language
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewLanguageForm;