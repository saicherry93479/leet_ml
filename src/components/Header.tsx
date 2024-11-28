import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import SessionTimer from "./SessionTimer";

const Header = ({ user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 left-0 z-50 w-full bg-white shadow-sm">
      <div className="max-w-[80rem] px-4 mx-auto">
        <div className="relative flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="block py-4 md:py-5">
            <p className="font-bold text-2xl md:text-[40px]">
              Leet <span className="text-purple-600">ML</span>
            </p>
          </a>

          {/* Mobile Menu Button */}
          <button
            className="p-2 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation and User Section */}
          <div
            className={`
            absolute top-full left-0 right-0 bg-white md:relative
            md:flex md:flex-1 md:items-center md:justify-between 
            transition-all duration-300 ease-in-out
            ${isMenuOpen ? "block" : "hidden md:flex"}
            shadow-md md:shadow-none
          `}
          >
            {/* Navigation Links */}
            <nav className="px-4 py-2 md:py-0">
              <ul className="space-y-2 md:space-y-0 md:flex md:items-center">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/problems">Problems</NavLink>
                {user?.admin === "Y" && (
                  <NavLink href="/newproblem">New Problem</NavLink>
                )}

                {/* Premium Status/Button */}
                <li className="md:ml-4">
                  {user?.premiumUser ? (
                    <div className="px-4 py-2 bg-white text-purple-500 font-bold text-sm rounded-lg border-2 border-purple-500">
                      Premium User
                    </div>
                  ) : user ? (
                    <a
                      href="/payment"
                      className="block px-4 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      Buy Premium
                    </a>
                  ) : null}
                </li>

                <NavLink href="/profile">Profile</NavLink>
              </ul>
            </nav>

            {/* User Section */}
            <div className="p-4 md:p-0 border-t md:border-none">
              {user ? (
                <div className="flex items-center gap-4 justify-end">
                  {/* <SessionTimer /> */}
                  <div className="h-10 w-10 rounded-lg overflow-hidden">
                    <img
                      className="h-full w-full object-cover"
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=9333ea&color=fff`}
                      alt={user.name}
                    />
                  </div>
                  <a
                    href="/logout"
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </a>
                </div>
              ) : (
                <a
                  href="/auth"
                  className="block w-full md:w-auto text-center px-6 py-3 bg-gradient-to-br from-purple-600 via-violet-600 to-[#4d0085] text-white font-medium rounded-md hover:opacity-90 transition-opacity"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Helper component for navigation links
const NavLink = ({ href, children }) => (
  <li>
    <a
      href={href}
      className="block py-2 px-2 text-base font-medium text-gray-800 hover:text-purple-600 transition-colors md:ml-8"
    >
      {children}
    </a>
  </li>
);

export default Header;
