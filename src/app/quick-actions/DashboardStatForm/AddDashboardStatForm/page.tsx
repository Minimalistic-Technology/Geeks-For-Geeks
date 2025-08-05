"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface AddDashboardStatFormProps {
  isOpen: boolean;
  onClose: () => void;
  onStatAdded: (newStat: {
    _id: string;
    icon: string;
    value: string;
    label: string;
  }) => void;
}

const AddDashboardStatForm: React.FC<AddDashboardStatFormProps> = ({
  isOpen,
  onClose,
  onStatAdded,
}) => {
  const [icon, setIcon] = useState("");
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const iconOptions = ["BookOpen", "Code", "User", "Users", "Trophy"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!icon || !value || !label) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/gfg/stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ icon, value, label }),
      });

      if (!response.ok) {
        throw new Error("Failed to add dashboard stat");
      }

      const newStat = await response.json();
      onStatAdded(newStat);
      setSuccess("Dashboard stat added successfully");
      setIcon("");
      setValue("");
      setLabel("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error adding dashboard stat");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Add Dashboard Stat
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded-lg mb-4">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="icon"
            >
              Icon
            </label>
            <select
              id="icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Icon</option>
              {iconOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="value"
            >
              Value
            </label>
            <input
              id="value"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., 50+"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="label"
            >
              Label
            </label>
            <input
              id="label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Languages"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Add Stat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDashboardStatForm;
