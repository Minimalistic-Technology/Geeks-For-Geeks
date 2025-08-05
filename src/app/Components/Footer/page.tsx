import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">GeeksHub</h3>
          <p className="text-sm text-gray-400">
            Your one-stop platform for learning programming, practicing
            problems, and competing globally.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Learn</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                Languages
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Tutorials
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Articles
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Videos
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Practice</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="/practice" className="hover:text-white">
                Problems
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contests
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Interview Prep
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Mock Tests
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-8">
        &copy; {new Date().getFullYear()} GeeksHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
