"use client";

import React, { useEffect, useState } from "react";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  BookOpen,
  Code2,
  Settings,
  BarChart3,
  Plus,
  FileText,
  LucideIcon,
  Trash2,
  Edit,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DocumentationForm from "../quick-actions/Sections/AddnewSectionform/page";
import AddNewLanguageForm from "../quick-actions/LanguageForms/AddnewLanguageform/page";
import RemoveLanguageForm from "../quick-actions/LanguageForms/RemovelanguageForm/page";
import UpdateLanguageForm from "../quick-actions/LanguageForms/UpdatelanguageForm/page";
import UpdateDocumentationForm from "../quick-actions/Sections/UpdateSection/page";
import RemoveDocumentationForm from "../quick-actions/Sections/RemoveSection/page";
import AddProblemForm from "../quick-actions/Practice-problems-forms/AddProblem/page";
import UpdateProblemForm from "../quick-actions/Practice-problems-forms/UpdateProblem/page";
import RemoveProblemForm from "../quick-actions/Practice-problems-forms/DeleteProblem/page";
import AddDashboardStatForm from "../quick-actions/DashboardStatForm/AddDashboardStatForm/page"; // New import
import UpdateDashboardStatForm from "../quick-actions/DashboardStatForm/UpdateDashboardStatForm/page"; // New import
import RemoveDashboardStatForm from "../quick-actions/DashboardStatForm/RemoveDashboardStatForm/page"; // New import

// TypeScript interfaces
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  color: string;
}

interface Language {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

interface Problem {
  _id: string;
  title: string;
  difficulty: string;
  description: string;
}

interface Section {
  _id: string;
  language: string;
  title: string;
}

interface DashboardStat {
  _id: string;
  icon: string;
  value: string;
  label: string;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isDocFormOpen, setIsDocFormOpen] = useState(false);
  const [isLangFormOpen, setIsLangFormOpen] = useState(false);
  const [isRemoveLangOpen, setIsRemoveLangOpen] = useState(false);
  const [isUpdateLangOpen, setIsUpdateLangOpen] = useState(false);
  const [isUpdateDocFormOpen, setIsUpdateDocFormOpen] = useState(false);
  const [isRemoveDocFormOpen, setIsRemoveDocFormOpen] = useState(false);
  const [isAddProblemFormOpen, setIsAddProblemFormOpen] = useState(false);
  const [isUpdateProblemFormOpen, setIsUpdateProblemFormOpen] = useState(false);
  const [isRemoveProblemFormOpen, setIsRemoveProblemFormOpen] = useState(false);
  const [isAddDashboardStatFormOpen, setIsAddDashboardStatFormOpen] =
    useState(false); // New state
  const [isUpdateDashboardStatFormOpen, setIsUpdateDashboardStatFormOpen] =
    useState(false); // New state
  const [isRemoveDashboardStatFormOpen, setIsRemoveDashboardStatFormOpen] =
    useState(false); // New state
  const [stats, setStats] = useState({
    totalProblems: 0,
    totalLanguages: 0,
    totalSections: 0,
    totalDashboardStats: 0, // New stat
  });
  const [languages, setLanguages] = useState<Language[]>([]);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStat[]>([]); // New state

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/language");
        if (!response.ok) {
          throw new Error("Failed to fetch languages");
        }
        const data = await response.json();
        setLanguages(data);
        setStats((prev) => ({ ...prev, totalLanguages: data.length }));
      } catch (err: any) {
        console.error(err.message || "Error fetching languages");
        setStats((prev) => ({ ...prev, totalLanguages: 0 }));
        setLanguages([]);
      }
    };

    const fetchProblems = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/problems");
        if (!response.ok) {
          throw new Error("Failed to fetch problems");
        }
        const data = await response.json();
        setProblems(data);
        setStats((prev) => ({ ...prev, totalProblems: data.length }));
      } catch (err: any) {
        console.error(err.message || "Error fetching problems");
        setStats((prev) => ({ ...prev, totalProblems: 0 }));
        setProblems([]);
      }
    };

    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/docs");
        if (!response.ok) {
          throw new Error("Failed to fetch sections");
        }
        const data = await response.json();
        setSections(data);
        setStats((prev) => ({ ...prev, totalSections: data.length }));
      } catch (err: any) {
        console.error(err.message || "Error fetching sections");
        setStats((prev) => ({ ...prev, totalSections: 0 }));
        setSections([]);
      }
    };

    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/gfg/stats");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard stats");
        }
        const data = await response.json();
        setDashboardStats(data);
        setStats((prev) => ({ ...prev, totalDashboardStats: data.length }));
      } catch (err: any) {
        console.error(err.message || "Error fetching dashboard stats");
        setStats((prev) => ({ ...prev, totalDashboardStats: 0 }));
        setDashboardStats([]);
      }
    };

    fetchLanguages();
    fetchProblems();
    fetchSections();
    fetchDashboardStats();
  }, []);

  const handleAddPracticeProblems = () => {
    setIsAddProblemFormOpen(true);
  };

  const handleAddLanguages = () => {
    setIsLangFormOpen(true);
  };

  const handleAddDocumentation = () => {
    setIsDocFormOpen(true);
  };

  const handleRemoveLanguages = () => {
    setIsRemoveLangOpen(true);
  };

  const handleUpdateLanguages = () => {
    setIsUpdateLangOpen(true);
  };

  const handleUpdateDocumentation = () => {
    setIsUpdateDocFormOpen(true);
  };

  const handleRemoveDocumentation = () => {
    setIsRemoveDocFormOpen(true);
  };

  const handleRemoveProblems = () => {
    setIsRemoveProblemFormOpen(true);
  };

  const handleUpdateProblems = () => {
    setIsUpdateProblemFormOpen(true);
  };

  const handleAddDashboardStat = () => {
    setIsAddDashboardStatFormOpen(true);
  };

  const handleUpdateDashboardStat = () => {
    setIsUpdateDashboardStatFormOpen(true);
  };

  const handleRemoveDashboardStat = () => {
    setIsRemoveDashboardStatFormOpen(true);
  };

  const handleLogout = () => {
    router.push("/login");
  };

  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    color = "red",
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`bg-${color}-100 p-3 rounded-full`}>
          <Icon className={`w-8 h-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const QuickActionCard: React.FC<QuickActionCardProps> = ({
    title,
    description,
    icon: Icon,
    onClick,
    color,
  }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-center space-x-4">
        <div
          className={`bg-${color}-100 p-3 rounded-full group-hover:bg-${color}-200 transition-colors duration-300`}
        >
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="bg-white shadow-xl border-b-4 border-red-500 sticky top-0 z-50">
        <div className="mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-red-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                Admin
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <div className="bg-red-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-red-600" />
                  </div>
                  <span className="hidden md:block font-medium text-gray-700">
                    Admin
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-10">
                    <div className="p-3 border-b border-gray-100">
                      <p className="font-medium text-gray-800">Administrator</p>
                      <p className="text-sm text-gray-500">
                        admin@geekshub.com
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center rounded-xl w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut size={16} className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-200" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Admin Control Center
            </h1>
            <p className="text-xl text-red-100 max-w-2xl mx-auto">
              Manage your platform with powerful administrative tools and
              real-time insights
            </p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-red-600" />
            Platform Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Practice Problems"
              value={stats.totalProblems}
              icon={BookOpen}
              color="orange"
            />
            <StatCard
              title="Programming Languages"
              value={stats.totalLanguages}
              icon={Code2}
              color="blue"
            />
            <StatCard
              title="Documentation Sections"
              value={stats.totalSections}
              icon={FileText}
              color="purple"
            />
            <StatCard
              title="Dashboard Stats"
              value={stats.totalDashboardStats}
              icon={BarChart3}
              color="green"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <Settings className="w-6 h-6 mr-2 text-red-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard
              title="Add Practice Problems"
              description="Create new coding challenges for users"
              icon={Plus}
              onClick={handleAddPracticeProblems}
              color="red"
            />
            <QuickActionCard
              title="Update Practice Problems"
              description="Modify existing coding challenges"
              icon={Edit}
              onClick={handleUpdateProblems}
              color="red"
            />
            <QuickActionCard
              title="Remove Practice Problems"
              description="Delete existing coding challenges"
              icon={Trash2}
              onClick={handleRemoveProblems}
              color="red"
            />
            <QuickActionCard
              title="Add Programming Languages"
              description="Add support for new programming languages"
              icon={Code2}
              onClick={handleAddLanguages}
              color="blue"
            />
            <QuickActionCard
              title="Remove Programming Languages"
              description="Remove existing programming languages"
              icon={Trash2}
              onClick={handleRemoveLanguages}
              color="blue"
            />
            <QuickActionCard
              title="Update Programming Languages"
              description="Modify existing programming languages"
              icon={Edit}
              onClick={handleUpdateLanguages}
              color="blue"
            />
            <QuickActionCard
              title="Add a Documentation Section"
              description="Create new documentation content"
              icon={FileText}
              onClick={handleAddDocumentation}
              color="purple"
            />
            <QuickActionCard
              title="Update Documentation Section"
              description="Modify existing documentation content"
              icon={Edit}
              onClick={handleUpdateDocumentation}
              color="purple"
            />
            <QuickActionCard
              title="Remove Documentation Section"
              description="Delete existing documentation content"
              icon={Trash2}
              onClick={handleRemoveDocumentation}
              color="purple"
            />
            <QuickActionCard
              title="Add Dashboard Stat"
              description="Create new dashboard statistic"
              icon={Plus}
              onClick={handleAddDashboardStat}
              color="green"
            />
            <QuickActionCard
              title="Update Dashboard Stat"
              description="Modify existing dashboard statistic"
              icon={Edit}
              onClick={handleUpdateDashboardStat}
              color="green"
            />
            <QuickActionCard
              title="Remove Dashboard Stat"
              description="Delete existing dashboard statistic"
              icon={Trash2}
              onClick={handleRemoveDashboardStat}
              color="green"
            />
          </div>
        </section>

        {/* Form Modals */}
        <DocumentationForm
          isOpen={isDocFormOpen}
          onClose={() => setIsDocFormOpen(false)}
          onSectionAdded={(newSection) => {
            setSections((prev) => [...prev, newSection]);
            setStats((prev) => ({
              ...prev,
              totalSections: prev.totalSections + 1,
            }));
          }}
        />
        <UpdateDocumentationForm
          isOpen={isUpdateDocFormOpen}
          onClose={() => setIsUpdateDocFormOpen(false)}
          onSectionUpdated={(updatedSections) => {
            setSections(updatedSections);
            setStats((prev) => ({
              ...prev,
              totalSections: updatedSections.length,
            }));
          }}
        />
        <RemoveDocumentationForm
          isOpen={isRemoveDocFormOpen}
          onClose={() => setIsRemoveDocFormOpen(false)}
          onSectionDeleted={(updatedSections) => {
            setSections(updatedSections);
            setStats((prev) => ({
              ...prev,
              totalSections: updatedSections.length,
            }));
          }}
        />
        <AddNewLanguageForm
          isOpen={isLangFormOpen}
          onClose={() => setIsLangFormOpen(false)}
        />
        <UpdateLanguageForm
          isOpen={isUpdateLangOpen}
          onClose={() => setIsUpdateLangOpen(false)}
          onLanguageUpdated={(updatedLanguages) => {
            setLanguages(updatedLanguages);
            setStats((prev) => ({
              ...prev,
              totalLanguages: updatedLanguages.length,
            }));
          }}
        />
        <RemoveLanguageForm
          isOpen={isRemoveLangOpen}
          onClose={() => setIsRemoveLangOpen(false)}
          onLanguageDeleted={(updatedLanguages) => {
            setLanguages(updatedLanguages);
            setStats((prev) => ({
              ...prev,
              totalLanguages: updatedLanguages.length,
            }));
          }}
        />
        <AddProblemForm
          isOpen={isAddProblemFormOpen}
          onClose={() => setIsAddProblemFormOpen(false)}
          onProblemAdded={(newProblem) => {
            setProblems((prev) => [...prev, newProblem]);
            setStats((prev) => ({
              ...prev,
              totalProblems: prev.totalProblems + 1,
            }));
          }}
        />
        <UpdateProblemForm
          isOpen={isUpdateProblemFormOpen}
          onClose={() => setIsUpdateProblemFormOpen(false)}
          onProblemUpdated={(updatedProblems) => {
            setProblems(updatedProblems);
            setStats((prev) => ({
              ...prev,
              totalProblems: updatedProblems.length,
            }));
          }}
        />
        <RemoveProblemForm
          isOpen={isRemoveProblemFormOpen}
          onClose={() => setIsRemoveProblemFormOpen(false)}
          onProblemDeleted={(updatedProblems) => {
            setProblems(updatedProblems);
            setStats((prev) => ({
              ...prev,
              totalProblems: updatedProblems.length,
            }));
          }}
        />
        <AddDashboardStatForm
          isOpen={isAddDashboardStatFormOpen}
          onClose={() => setIsAddDashboardStatFormOpen(false)}
          onStatAdded={(newStat) => {
            setDashboardStats((prev) => [...prev, newStat]);
            setStats((prev) => ({
              ...prev,
              totalDashboardStats: prev.totalDashboardStats + 1,
            }));
          }}
        />
        <UpdateDashboardStatForm
          isOpen={isUpdateDashboardStatFormOpen}
          onClose={() => setIsUpdateDashboardStatFormOpen(false)}
          onStatUpdated={(updatedStats) => {
            setDashboardStats(updatedStats);
            setStats((prev) => ({
              ...prev,
              totalDashboardStats: updatedStats.length,
            }));
          }}
        />
        <RemoveDashboardStatForm
          isOpen={isRemoveDashboardStatFormOpen}
          onClose={() => setIsRemoveDashboardStatFormOpen(false)}
          onStatDeleted={(updatedStats) => {
            setDashboardStats(updatedStats);
            setStats((prev) => ({
              ...prev,
              totalDashboardStats: updatedStats.length,
            }));
          }}
        />
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-white shadow-lg border-t-4 border-red-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center items-center">
            <p className="text-gray-600">
              © 2025 GeeksHub Admin Panel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;