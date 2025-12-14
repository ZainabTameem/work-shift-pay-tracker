"use client";

import { useState } from "react";
import { RoundedFilledButton } from "../Buttons";
import { GoogleButton } from "../GoogleButton";
import { signInWithEmail } from "@/app/lib/authHelpers";
export default function LoginForm() {
  // email state for form
  const [email, setEmail] = useState("");
  // password state for form
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // destruct user and error from awaiting logInWithEmail and pass the email and password to it
    const { user, error } = await signInWithEmail(email, password);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-md mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">Sign in</h1>

      <form onSubmit={handleSignIn} className="w-full space-y-4">
        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="text-sm font-light mb-1 block"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full h-[70px] px-4 border-4 border-[#4CA9A0] bg-[#DDFCE7] rounded-[40px] text-lg"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="text-sm font-light mb-1 block"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full h-[70px] px-4 border-4 border-[#4CA9A0] bg-[#DDFCE7] rounded-[40px] text-lg"
          />
        </div>

        {/* Forgot Password */}
        <p className="text-xs text-gray-500">
          Forgot password? Try another way to sign in.
        </p>

        {/* Sign In Button */}
        <div className="mt-4">
          <RoundedFilledButton text="Sign In" onClick={handleSignIn} />
        </div>

        {/* OR Divider */}
        <div className="flex items-center justify-center my-4 text-gray-400">
          <span className="border-t border-gray-300 flex-1 mr-2"></span>
          OR
          <span className="border-t border-gray-300 flex-1 ml-2"></span>
        </div>

        {/* Google Button */}
        <div className="flex justify-center">
          <GoogleButton onClick={() => console.log("Sign in with Google")} />
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-[#0E4C58] font-medium">
            Sign up
          </a>
          .
        </p>
      </form>
    </div>
  );
}
