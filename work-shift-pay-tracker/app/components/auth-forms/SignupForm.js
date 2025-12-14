"use client";

import { useState } from "react";
import { signUpWithEmailAndPassword, signInWithGoogle } from "../../lib/authHelpers";
import { RoundedFilledButton } from "../Buttons";
import { GoogleButton } from "../GoogleButton";

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const { user, error } = await signUpWithEmailAndPassword(email, password);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setUsername("");
      setEmail("");
      setPassword("");
      console.log("User signed up:", user);
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);

    const { user, error } = await signInWithGoogle();
    if (error) {
      setError(error);
    } else {
      console.log("Google signed up:", user);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Create an account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username Input */}
        <div>
          <label htmlFor="signup-username" className="block text-sm font-thin mb-1">
            Username
          </label>
          <input
            id="signup-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
            placeholder="Enter your username"
            className="w-full h-[70px] px-4 border-4 border-[#4CA9A0] bg-[#DDFCE7] rounded-[40px] text-lg"
          />
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-thin mb-1">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="you@example.com"
            className="w-full h-[70px] px-4 border-4 border-[#4CA9A0] bg-[#DDFCE7] rounded-[40px] text-lg"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-thin mb-1">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            placeholder="At least 6 characters"
            className="w-full h-[70px] px-4 border-4 border-[#4CA9A0] bg-[#DDFCE7] rounded-[40px] text-lg"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
            Account created successfully!
          </div>
        )}

        {/* Sign Up Button */}
        <div className="mt-4">
          <RoundedFilledButton
            text={loading ? "Creating account..." : "Sign Up"}
            onClick={handleSubmit}
          />
        </div>

        {/* OR Divider */}
        <div className="flex items-center justify-center my-4 text-gray-400">
          <span className="border-t border-gray-300 flex-1 mr-2"></span>
          OR
          <span className="border-t border-gray-300 flex-1 ml-2"></span>
        </div>

        {/* Google Button */}
        <div className="flex justify-center">
          <GoogleButton onClick={handleGoogleSignUp} />
        </div>

        {/* Informational Text */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Already have an account? Please use the sign-in form above.
        </div>
      </form>
    </div>
  );
}
