import React from 'react';
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full">
        <ClerkSignIn 
          routing="path" 
          path="/sign-in" 
          redirectUrl="/"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
};

export default SignIn;