"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Edit,
  LogOut,
  Code,
  Settings,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Profile = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [problemsSolved, setProblemsSolved] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [joinDate] = useState("January 2024");
  const [rank, setRank] = useState("User");

useEffect(() => {
  const fetchProfile = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken"); // This is now the _id

    if (!userId || !token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Using _id as bearer token
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setUsername(data.username);
      setProblemsSolved(data.problemSolved);
      setRank(data.role);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
      router.push("/login");
    }
  };

  fetchProfile();
}, [router]);

  const handleEditProfile = () => {
    setIsEditing(true);
    setNewUsername(username);
  };

  const handleSaveProfile = async () => {
    if (!newUsername || !/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      setError(
        "Username should contain only letters, numbers, or underscores."
      );
      return;
    }

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/username/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username: newUsername }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update username");
      }

      const data = await response.json();
      setUsername(data.username);
      setIsEditing(false);
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewUsername(username);
    setError("");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    router.push("/login");
  };

  const handleBackToDashboard = () => {
    router.push("/Dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg border-b-2 border-green-500">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                GeeksHub
              </h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-600">
                <User className="w-5 h-5" />
                <span className="font-medium">{username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12 relative">
            
            <div className="relative z-10 flex items-center justify-center  space-x-6">
              <div className="bg-white p-4 rounded-full shadow-lg">
                <User className="w-16 h-16 text-green-600" />
              </div>
              <div className="text-white ">
                <h2 className="text-3xl font-bold mb-2">{username}</h2>
                <div className="flex items-center space-x-4 text-green-100">
                  <span className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    {rank}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-green-600" />
                  Profile Settings
                </h3>
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="flex items-center px-4 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Username
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your username"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={handleSaveProfile}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border">
                      <span className="text-lg font-medium text-gray-900">
                        {username}
                      </span>
                    </div>
                  )}
                  {error && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                      {error}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        Problems Solved
                      </p>
                      <p className="text-2xl font-bold text-green-700">
                        {problemsSolved}
                      </p>
                    </div>
                    <Code className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        Current Role
                      </p>
                      <p className="text-lg font-bold text-blue-700">{rank}</p>
                    </div>
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow-lg border-t-2 border-green-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-600 ">
              © 2025 GeeksHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Profile;