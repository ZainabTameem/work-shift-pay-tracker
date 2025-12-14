"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { RoundedFilledButton } from "../../components/Buttons";
import { auth } from "../../lib/firebase";
import Input from "../../components/Input";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      alert(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 mt-15 flex flex-col items-center">

      <div className="bg-white mt-16 w-full max-w-md rounded-xl shadow-md p-8">
        <h2 className="text-center text-xl font-semibold mb-6">
          Sign in with
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            placeholder="Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="text-xs text-center text-gray-500">
            Forgot password? Try another way to sign in.
          </p>
          <div className="flex justify-center mt-4">
            <RoundedFilledButton
              text={loading ? "Signing in..." : "Sign in"}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">OR</span>
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

