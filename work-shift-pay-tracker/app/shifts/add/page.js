"use client";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { addShift } from "../../lib/firestore";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function AddShiftPage() {
  const { user, loading } = useAuth();

  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || saving) return;
    if (!date || !start || !end) {
      alert("Please fill all fields");
      return;
    }

    setSaving(true);

    try {
      console.log("Before addShift");

      await addShift(user.uid, {
        date,
        start,
        end,
        createdAt: new Date(),
      });

      console.log("After addShift");

      alert("Shift added successfully!");

      setDate("");
      setStart("");
      setEnd("");
    } catch (error) {
      console.error("Firestore error:", error);
      alert("Failed to add shift");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="mt-10 text-center">Please log in</div>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 space-y-4"
    >
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Input
        type="time"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        required
      />

      <Input
        type="time"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        required
      />

      <Button disabled={saving}>
        {saving ? "Saving..." : "Add Shift"}
      </Button>
    </form>
  );
}