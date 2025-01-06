import React from 'react';
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";

const SignIn = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-md w-full">
        <ClerkSignIn 
          routing="path" 
          path="/sign-in"
          afterSignInUrl="/home"
          signUpUrl="/sign-up"
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

export default SignIn;