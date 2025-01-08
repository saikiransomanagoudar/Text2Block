import React from "react";
import { useUser } from "@clerk/clerk-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage";
import SignIn from "./components/Authentication/SignIn";
import SignUp from "./components/Authentication/SignUp";
import HomePage from "./components/HomePage/HomePage";

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <Routes>
          <Route
            path="/sign-in"
            element={!isSignedIn ? <SignIn /> : <Navigate to="/home" />}
          />
          <Route
            path="/sign-in/sso-callback"
            element={!isSignedIn ? <SignIn /> : <Navigate to="/home" />}
          />
          <Route
            path="/sign-up"
            element={!isSignedIn ? <SignUp /> : <Navigate to="/home" />}
          />
          <Route
            path="/sign-up/verify-email-address"
            element={!isSignedIn ? <SignUp /> : <Navigate to="/home" />}
          />
          <Route
            path="/sign-up/sso-callback"
            element={!isSignedIn ? <SignUp /> : <Navigate to="/home" />}
          />
          <Route
            path="/home"
            element={isSignedIn ? <HomePage /> : <Navigate to="/sign-in" />}
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
