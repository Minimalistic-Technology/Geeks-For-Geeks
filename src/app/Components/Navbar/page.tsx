import React from "react";
import { Menu, User, X } from "lucide-react";
import SearchBar from "../Searchbar/page";
import NotificationPanel from "../NotificationPanel/page";

interface NavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  handleSignIn: () => void;
  handleProfileClick: () => void;
  handlePracticeProblems: () => void;
  handleNavigation: (path: string) => void;
  notifications: any[]; // Adjust type based on your Notification interface
  isNotificationOpen: boolean;
  toggleNotifications: () => void;
  isNotificationLoading: boolean;
  notificationError: string | null;
  hoveredNotification: string | null;
  setHoveredNotification: (id: string | null) => void;
  fetchNotifications: () => void;
  markAsReadAndDelete: (id: string) => void;
  markAllAsReadAndDelete: () => void;
  formatDate: (dateString: string) => string;
  notificationRef: React.RefObject<HTMLDivElement>;
  handleSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isLoggedIn,
  handleSignIn,
  handleProfileClick,
  handlePracticeProblems,
  handleNavigation,
  notifications,
  isNotificationOpen,
  toggleNotifications,
  isNotificationLoading,
  notificationError,
  hoveredNotification,
  setHoveredNotification,
  fetchNotifications,
  markAsReadAndDelete,
  markAllAsReadAndDelete,
  formatDate,
  notificationRef,
  handleSearch,
}) => {
  return (
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
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/Practice-problems");
              }}
              className="text-gray-500 hover:text-green-600"
            >
              Practice
            </a>
            <a
              href="/compiler"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/compiler");
              }}
              className="text-gray-500 hover:text-green-600"
            >
              Compiler
            </a>
          </nav>
          <div className="flex items-center space-x-4">
            <NotificationPanel
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
            />
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
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/Practice-problems");
              }}
              className="block text-gray-600 py-2"
            >
              Practice
            </a>
            <a
              href="/compiler"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation("/compiler");
              }}
              className="block text-gray-600 py-2"
            >
              Compiler
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
