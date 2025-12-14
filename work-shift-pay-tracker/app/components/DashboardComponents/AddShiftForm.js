"use client";

import { useState } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddShiftForm() {
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [notes, setNotes] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    try {
      await addDoc(collection(doc(db, "users", user.uid), "shifts"), {
        date,
        start,
        end,
        notes,
        createdAt: new Date(),
      });

      alert("Shift added successfully!");

      setDate("");
      setStart("");
      setEnd("");
      setNotes("");

      // router.push("/shifts");
    } catch (err) {
      alert(err.message);
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
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
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
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
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
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
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
              className="w-full border border-gray-300 p-3 rounded-lg 
              focus:ring-2 focus:ring-[#0E4C58] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#0E4C58]  dark:bg-[#C7F1D9] text-white text-lg dark:text-gray-700 font-medium py-3 
            rounded-xl hover:bg-[#0C3F4A]  dark:hover:bg-[#85B79B] transition-all shadow-md"
          >
            Add Shift
          </button>

        </form>
      </div>
    </div>
  );
}
