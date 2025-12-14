"use client";
import LoginForm from "../components/auth-forms/LoginForm"; // path adjusted

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
      <LoginForm />
    </div>
  );
}
