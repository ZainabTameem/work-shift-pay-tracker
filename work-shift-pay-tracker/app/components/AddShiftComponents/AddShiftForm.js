"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddShiftForm() {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [crossMidnight, setCrossMidnight] = useState(""); // "yes" or "no"
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to add a shift.");

    if (!date || !start || !end || !crossMidnight) {
      return alert("Please fill out all required fields.");
    }

    const cross = crossMidnight.trim().toLowerCase();
    if (cross !== "yes" && cross !== "no") {
      return alert('Please enter "yes" or "no" for crossing midnight.');
    }

    // Validate shift times
    const startTime = new Date(`${date}T${start}`);
    let endTime = new Date(`${date}T${end}`);

    // Reject zero-length shifts
    if (startTime.getTime() === endTime.getTime()) {
      return alert("Start time and end time cannot be the same.");
    }

    // Handle shifts and validate crossing midnight
    if (cross === "yes" && endTime <= startTime) {
      // Shift crosses midnight, adjust end time
      endTime.setDate(endTime.getDate() + 1);
    } else if (cross === "no" && endTime <= startTime) {
      // Invalid: end is before start but not marked as crossing midnight
      return alert(
        "End time is before start time. Please mark as crossing midnight if it goes past midnight."
      );
    } else if (cross === "yes" && endTime > startTime) {
      // Invalid: marked as crossing midnight but end is after start on same day
      return alert("Shift does not cross midnight. Please select 'no'.");
    }

    try {
      setLoading(true);

      await addDoc(collection(doc(db, "users", user.uid), "shifts"), {
        date,
        start,
        end,
        crossMidnight: cross,
        notes,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        createdAt: serverTimestamp(),
      });

      alert("Shift added successfully!");

      // Reset form
      setDate("");
      setStart("");
      setEnd("");
      setCrossMidnight("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert("Unable to add shift. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center pt-16 px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl border border-gray-200 rounded-2xl p-10 dark:bg-gray-700">
        <h2 className="text-2xl font-semibold text-center text-[#0E4C58] dark:text-[#DDFCE7] mb-8 tracking-wide">
          Add New Shift
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#DDFCE7] mb-1">
              Shift Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#DDFCE7] mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#DDFCE7] mb-1">
              End Time
            </label>
            <input
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
            />
          </div>

          {/* Cross Midnight as Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#DDFCE7] mb-1">
              Does this shift cross midnight?
            </label>
            <input
              type="text"
              value={crossMidnight}
              onChange={(e) => setCrossMidnight(e.target.value.toLowerCase())}
              placeholder="yes or no"
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0E4C58] focus:outline-none text-black dark:text-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-[#DDFCE7] mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes..."
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-lg font-medium py-3 rounded-xl shadow-md transition-all
              ${loading
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "bg-[#0E4C58] hover:bg-[#0C3F4A] dark:bg-[#C7F1D9] dark:text-gray-700 dark:hover:bg-[#85B79B] text-white"
              }`}
          >
            {loading ? "Adding Shift..." : "Add Shift"}
          </button>
        </form>
      </div>
    </div>
  );
}
