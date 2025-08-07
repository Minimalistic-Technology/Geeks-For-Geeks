"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Bell,
  User,
  RefreshCw,
  CheckCircle,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "../Components/Footer/page";
import Languages from "../Components/Languages_tabs/page";
import DashboardStats from "../Components/DashboardStats/page";
import SearchBar from "../Components/Searchbar/page";

interface Problem {
  _id: string;
  title: string;
  tags?: string[];
}

interface Language {
  _id: string;
  name: string;
}

interface Notification {
  _id: string;
  message: string;
  type: "problem" | "language";
  createdBy: "user" | "admin";
  createdAt: string;
  user: string;
  isRead: boolean;
}

const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(
    null
  );
  const [isNotificationLoading, setIsNotificationLoading] = useState(false);
  const [filteredContent, setFilteredContent] = useState<{
    type: "language" | "problem" | null;
    data: any[];
  }>({ type: null, data: [] });
  const [loading, setLoading] = useState(true);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(
    null
  );
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId") || "";
        const [problemsRes, languagesRes, notificationsRes] = await Promise.all(
          [
            fetch("http://localhost:5000/api/gfg/problems"),
            fetch("http://localhost:5000/api/gfg/language"),
            fetch(
              `http://localhost:5000/api/gfg/notification/?user=${encodeURIComponent(
                userId
              )}`
            ),
          ]
        );

        if (!problemsRes.ok) {
          throw new Error("Failed to fetch problems");
        }
        if (!languagesRes.ok) {
          throw new Error("Failed to fetch languages");
        }
        if (!notificationsRes.ok) {
          setNotificationError("Failed to fetch notifications");
          setNotifications([]);
        } else {
          const notificationsData = await notificationsRes.json();
          setNotifications(notificationsData);
        }

        const problemsData = await problemsRes.json();
        const languagesData = await languagesRes.json();
        setProblems(problemsData);
        setLanguages(languagesData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setNotificationError("Error fetching data");
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchNotifications = async () => {
    setIsNotificationLoading(true);
    try {
      const userId = localStorage.getItem("userId") || "";
      const response = await fetch(
        `http://localhost:5000/api/gfg/notification/?user=${encodeURIComponent(
          userId
        )}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch notifications: ${response.statusText}`
        );
      }
      const notificationsData = await response.json();
      setNotifications(notificationsData);
      setNotificationError(null);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setNotificationError("Error fetching notifications");
    } finally {
      setIsNotificationLoading(false);
    }
  };

  const markAsReadAndDelete = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/gfg/notification/read/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to mark notification as read: ${response.statusText}`
        );
      }
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      setNotificationError("Error marking notification as read");
    }
  };

  const markAllAsReadAndDelete = async () => {
    try {
      const userId = localStorage.getItem("userId") || "";
      const response = await fetch(
        "http://localhost:5000/api/gfg/notification/mark-all-read",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to mark all notifications as read: ${response.statusText}`
        );
      }
      setNotifications(notifications.filter((n) => n.isRead));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      setNotificationError("Error marking all notifications as read");
    }
  };

  const handleSignIn = () => {
    router.push("/login");
  };

  const handlePracticeProblems = () => {
    router.push("/Practice-problems");
  };

  const handleProfileClick = () => {
    router.push("/user-profile");
  };

  const handleSearch = (term: string) => {
    // Triggered by SearchBar
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const handleRefreshNotifications = () => {
    fetchNotifications();
  };

  const solveProblem = async (problemId: string) => {
    const problem = problems.find((p) => p._id === problemId);
    if (!problem) return;

    try {
      const userId = localStorage.getItem("userId") || "user";
      const response = await fetch(
        "http://localhost:5000/api/gfg/notification/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({
            message: `${problem.title} solved`,
            type: "problem",
            createdBy: "user",
            user: userId,
            isRead: false,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(
          `Failed to create notification: ${response.statusText}`
        );
      }
      fetchNotifications();
    } catch (err) {
      console.error("Failed to create solve notification:", err);
      setNotificationError("Error creating solve notification");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    const query = searchParams.get("query")?.toLowerCase();
    if (query) {
      const matchedProblem = problems.find(
        (p) => p.title.toLowerCase() === query
      );
      if (matchedProblem) {
        setFilteredContent({ type: "problem", data: [matchedProblem] });
        router.push(`/Practice-problems?query=${encodeURIComponent(query)}`);
        return;
      }

      const matchedTagProblem = problems.filter(
        (p) => p.tags && p.tags.some((tag) => tag.toLowerCase() === query)
      );
      if (matchedTagProblem.length > 0) {
        setFilteredContent({ type: "problem", data: matchedTagProblem });
        router.push(`/Practice-problems?tag=${encodeURIComponent(query)}`);
        return;
      }

      const matchedLanguage = languages.find(
        (lang) => lang.name.toLowerCase() === query
      );
      if (matchedLanguage) {
        router.push(
          `../documentation/${encodeURIComponent(
            matchedLanguage.name.toLowerCase()
          )}`
        );
        return;
      }

      setFilteredContent({ type: null, data: [] });
    } else {
      setFilteredContent({ type: null, data: [] });
    }
  }, [searchParams, problems, languages, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/learning-logo.png"
                alt="Minimalistic Technology Logo"
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-green-600">
                Minimalistic Learning
              </h1>
            </div>
            <div className="hidden md:block flex-1 max-w-lg mx-8">
              <SearchBar onSearch={handleSearch} />
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="/Practice-problems"
                className="text-gray-500 hover:text-green-600"
              >
                Practice
              </a>
              <a
                href="/compiler"
                className="text-gray-500 hover:text-green-600"
              >
                Compiler
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell
                  className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer"
                  onClick={toggleNotifications}
                />
                {notifications.some((n) => !n.isRead) && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                {isNotificationOpen && (
                  <div
                    ref={notificationRef}
                    className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg border border-gray-200 z-10"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Notifications
                        </h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleRefreshNotifications}
                            className="text-gray-500 hover:text-green-600 flex items-center"
                          >
                            <RefreshCw
                              className={`w-4 h-4 mr-1 ${
                                isNotificationLoading ? "animate-spin" : ""
                              }`}
                            />
                            Refresh
                          </button>
                        </div>
                      </div>
                      {isNotificationLoading ? (
                        <p className="text-gray-600 text-sm">Loading...</p>
                      ) : notificationError ? (
                        <p className="text-red-600 text-sm">
                          {notificationError}
                        </p>
                      ) : notifications.length === 0 ? (
                        <p className="text-gray-600 text-sm">
                          No notifications available.
                        </p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification._id}
                              className="py-3 px-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                              onMouseEnter={() =>
                                setHoveredNotification(notification._id)
                              }
                              onMouseLeave={() => setHoveredNotification(null)}
                            >
                              <div>
                                <p
                                  className={`text-sm ${
                                    notification.isRead
                                      ? "text-gray-600"
                                      : "font-medium text-gray-800"
                                  }`}
                                >
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(notification.createdAt)}
                                </p>
                              </div>
                              {hoveredNotification === notification._id &&
                                !notification.isRead && (
                                  <button
                                    onClick={() =>
                                      markAsReadAndDelete(notification._id)
                                    }
                                    className="text-gray-500 hover:text-green-600"
                                    title="Mark as read and delete"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                            </div>
                          ))}
                          {notifications.some((n) => !n.isRead) && (
                            <div className="pt-3 border-t border-gray-100">
                              <button
                                onClick={markAllAsReadAndDelete}
                                className="w-full text-left text-sm text-red-600 hover:text-red-800 flex items-center justify-center"
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Mark All as Read
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {isLoggedIn ? (
                <User
                  className="w-6 h-6 text-gray-600 hover:text-green-600 cursor-pointer"
                  onClick={handleProfileClick}
                />
              ) : (
                <button
                  onClick={handleSignIn}
                  className="text-gray-600 hover:text-green-600 font-medium"
                >
                  Sign In
                </button>
              )}
              <button
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-t px-4 pt-2 pb-4">
              <div className="mb-4">
                <SearchBar onSearch={handleSearch} />
              </div>
              <a
                href="#"
                onClick={handlePracticeProblems}
                className="block text-gray-600 py-2"
              >
                Practice
              </a>
              <a href="/compiler" className="block text-gray-600 py-2">
                Compiler
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 text-center">
        <h1 className="text-5xl font-bold mb-4">Learn. Code. Compete.</h1>
        <p className="text-xl mb-8">
          Master programming with problems, contests and coding languages
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Coding
          </button>
          <button
            onClick={handlePracticeProblems}
            className="border cursor-pointer border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600"
          >
            Practice Problems
          </button>
        </div>
      </section>

      {/* Stats */}
      <DashboardStats />

      {/* Filtered Content */}
      {filteredContent.type === "problem" && filteredContent.data.length > 0 ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Search Results</h2>
            <div className="grid grid-cols-1 gap-6">
              {filteredContent.data.map((problem: Problem) => (
                <div
                  key={problem._id}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold">{problem.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {problem.tags?.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => solveProblem(problem._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Solve Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : filteredContent.type ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-gray-600 text-center">No results found.</p>
          </div>
        </section>
      ) : (
        <Languages languages={languages} />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;