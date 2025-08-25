"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Footer from "../Components/Footer/page";
import Languages from "../Components/Languages_tabs/page";
import DashboardStats from "../Components/DashboardStats/page";
import LoadingOverlay from "../Components/LoadingOverley/page";
import HeroSection from "../Components/HeroSection/page";
import Navbar from "../Components/Navbar/page";

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
  const pathname = usePathname();
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
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(
    null
  );
  const notificationRef = useRef<HTMLDivElement>(null);
  const prevPathname = useRef<string | null>(null);

  const handleNavigation = useCallback(
    (path: string) => {
      setIsPageLoading(true);
      router.push(path);
      setTimeout(() => setIsPageLoading(false), 500);
    },
    [router]
  );

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
    handleNavigation("/login");
  };

  const handlePracticeProblems = () => {
    handleNavigation("/Practice-problems");
  };

  const handleProfileClick = () => {
    handleNavigation("/user-profile");
  };

  const handleSearch = (term: string) => {
    const query = term.toLowerCase();
    if (query) {
      handleNavigation(`/Practice-problems?query=${encodeURIComponent(query)}`);
    }
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
        handleNavigation(
          `/Practice-problems?query=${encodeURIComponent(query)}`
        );
        return;
      }

      const matchedTagProblem = problems.filter(
        (p) => p.tags && p.tags.some((tag) => tag.toLowerCase() === query)
      );
      if (matchedTagProblem.length > 0) {
        setFilteredContent({ type: "problem", data: matchedTagProblem });
        handleNavigation(`/Practice-problems?tag=${encodeURIComponent(query)}`);
        return;
      }

      const matchedLanguage = languages.find(
        (lang) => lang.name.toLowerCase() === query
      );
      if (matchedLanguage) {
        handleNavigation(
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
  }, [searchParams, problems, languages, handleNavigation]);

  useEffect(() => {
    if (prevPathname.current && prevPathname.current !== pathname) {
      setIsPageLoading(true);
      const timer = setTimeout(() => setIsPageLoading(false), 500);
      return () => clearTimeout(timer);
    }
    prevPathname.current = pathname;
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {isPageLoading && <LoadingOverlay />}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        handleSignIn={handleSignIn}
        handleProfileClick={handleProfileClick}
        handlePracticeProblems={handlePracticeProblems}
        handleNavigation={handleNavigation}
        notifications={notifications}
        isNotificationOpen={isNotificationOpen}
        toggleNotifications={toggleNotifications}
        isNotificationLoading={isNotificationLoading}
        notificationError={notificationError}
        hoveredNotification={hoveredNotification}
        setHoveredNotification={setHoveredNotification}
        fetchNotifications={fetchNotifications}
        markAsReadAndDelete={markAsReadAndDelete}
        markAllAsReadAndDelete={markAllAsReadAndDelete}
        formatDate={formatDate}
        notificationRef={notificationRef}
        handleSearch={handleSearch}
      />
      <HeroSection handlePracticeProblems={handlePracticeProblems} />
      <DashboardStats />
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
