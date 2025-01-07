import React from 'react';
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";

const SignUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full">
        <ClerkSignUp 
          routing="path" 
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-slate-800 hover:bg-slate-900 text-sm normal-case",
              socialButtonsBlockButton: 
                "bg-white hover:bg-gray-50 text-gray-900 text-sm normal-case",
            },
            variables: {
              colorPrimary: '#1a365d',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignUp;