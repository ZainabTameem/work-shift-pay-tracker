"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import Input from "../../components/Input";
import { RoundedFilledButton } from "../../components/Buttons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/view");
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      switch (err.code) {
        case "auth/user-not-found":
          message = "No account found with this email.";
          break;
        case "auth/wrong-password":
          message = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Try again later.";
          break;
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-15 flex flex-col items-center dark:bg-gray-700">
      <div className="bg-white dark:bg-gray-800 mt-16 w-full max-w-md rounded-xl shadow-md p-8 dark:text-white mb-6">
        <h2 className="text-center text-xl font-semibold mb-6">Sign in</h2>

        <form onSubmit={handleSubmit} className="space-y-5 dark:text-white">
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-center mt-4">
            <RoundedFilledButton
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-full text-center bg-teal-700"
              text={loading ? "Signing in..." : "Sign in"}
            />
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500 dark:text-white">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <p className="text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="text-teal-700 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
