import React from 'react';
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full">
        <ClerkSignUp 
          routing="path" 
          path="/sign-up" 
          redirectUrl="/"
          signInUrl="/sign-in"
        />
      </div>
    </div>
  );
};

export default SignUp;