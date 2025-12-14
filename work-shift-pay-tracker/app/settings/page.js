"use client";

import { useAuth } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuth();
  const [wage, setWage] = useState("");

  if (!user) {
    return <div className="mt-10 text-center">Please log in</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>

      <Input
        type="number"
        placeholder="Hourly Wage"
        value={wage}
        onChange={(e) => setWage(e.target.value)}
      />

      <Button>Save</Button>
    </div>
  );
}