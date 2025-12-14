"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

import Input from "../../components/Input";
import Button from "../../components/Button";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
      });
      router.push("/auth/login");
    } catch (err) {
      alert(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full bg-emerald-100 py-4 px-8 flex justify-between items-center">
        <h1 className="font-semibold tracking-wide">WORKLY</h1>
        <span className="text-sm tracking-wide">PAY & SHIFT TRACKER</span>
      </header>

      <div className="bg-white mt-16 w-full max-w-md rounded-xl shadow-md p-8">
        <h2 className="text-center text-xl font-semibold mb-6">
          Create an account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button disabled={loading}>Sign up</Button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300" />
          <span className="px-4 text-sm text-gray-500">OR</span>
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