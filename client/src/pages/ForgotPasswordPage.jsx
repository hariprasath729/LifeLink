import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-600">
          The backend functionality for password resets is not yet implemented. This is a placeholder for a future feature.
        </p>
        <form className="space-y-6">
          <input
            type="text"
            placeholder="Enter your username or email"
            disabled
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 rounded-md cursor-not-allowed"
          />
          <button
            type="button"
            disabled
            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md opacity-50 cursor-not-allowed"
          >
            Send Reset Link
          </button>
        </form>
        <Link to="/login" className="font-medium text-primary hover:underline">
          &larr; Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;