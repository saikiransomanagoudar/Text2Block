import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1
          onClick={() => handleNavigation("/")}
          className="text-white text-2xl font-bold cursor-pointer"
        >
          Text2Block
        </h1>

        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavigation('/home')}
              className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Home
            </button>
            <span className="text-white">
              Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
            </span>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => handleNavigation("/sign-in")}
              className="px-4 py-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => handleNavigation("/sign-up")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
