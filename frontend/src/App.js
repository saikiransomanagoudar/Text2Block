import React from 'react';
import { useUser } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage/LandingPage';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';

function App() {
  const { isSignedIn } = useUser();
  const path = window.location.pathname;

  const renderContent = () => {
    switch (path) {
      case '/sign-in':
        return <SignIn />;
      case '/sign-up':
        return <SignUp />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {renderContent()}
    </div>
  );
}

export default App;