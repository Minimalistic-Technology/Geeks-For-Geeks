"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Code, User, Users, Trophy } from "lucide-react";

interface Stat {
  _id: string;
  icon: string;
  value: string;
  label: string;
}

const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map API icon names to Lucide icons
  const iconMap: {
    [key: string]: React.ComponentType<{ size: number; className: string }>;
  } = {
    BookOpen: BookOpen,
    Code: Code,
    User: User,
    Users: Users,
    Trophy: Trophy,
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching stats");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-16">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-center py-16 text-red-600">{error}</div>;
  }

  return (
    <section className="py-16 bg-white">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto text-center">
        {stats.map((stat) => {
          const IconComponent = iconMap[stat.icon] || BookOpen; // Fallback to BookOpen if icon not found
          const iconColor =
            {
              BookOpen: "text-green-600",
              Code: "text-blue-600",
              User: "text-yellow-600",
              Users: "text-purple-600",
              Trophy: "text-amber-600",
            }[stat.icon] || "text-green-600";

          return (
            <div key={stat._id}>
              <IconComponent
                className={`mx-auto mb-2 ${iconColor}`}
                size={40}
              />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardStats;
