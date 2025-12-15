"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import Input from "../../components/Input";
import { RoundedFilledButton } from "../../components/Buttons";

import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
      });

      alert("Account created successfully! Please login.");
      router.push("/auth/login");
    } catch (err) {
      let message = "Something went wrong. Please try again.";
      switch (err.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters.";
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
        <h2 className="text-center text-xl font-semibold mb-6">Create an account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            type="email"
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
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <div className="flex justify-center mt-4">
            <RoundedFilledButton
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-full text-center bg-teal-700"
              text={loading ? "Creating account..." : "Sign up"}
            />
          </div>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500 dark:text-white">OR</span>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-teal-700 font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
