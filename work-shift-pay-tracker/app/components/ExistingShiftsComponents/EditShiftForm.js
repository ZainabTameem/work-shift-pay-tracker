"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function EditShifts() {
  const [shifts, setShifts] = useState([]);
  const [editingShiftId, setEditingShiftId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editCrossMidnight, setEditCrossMidnight] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const shiftsRef = collection(doc(db, "users", user.uid), "shifts");
    const unsubscribe = onSnapshot(shiftsRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setShifts(data);
    });

    return () => unsubscribe();
  }, []);

  const shiftHours = (shift) => {
    const [sh, sm] = shift.start.split(":").map(Number);
    const [eh, em] = shift.end.split(":").map(Number);
    let diff = eh * 60 + em - (sh * 60 + sm);
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).toFixed(1);
  };

  const handleEdit = (shift) => {
    setEditingShiftId(shift.id);
    setEditDate(shift.date || "");
    setEditStart(shift.start || "");
    setEditEnd(shift.end || "");
    setEditCrossMidnight(shift.crossMidnight || "no");
  };
  const handleSave = async (id) => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    if (!editDate || !editStart || !editEnd || !editCrossMidnight) {
      return alert("All fields are required.");
    }
    const cross = editCrossMidnight.trim().toLowerCase();
    if (cross !== "yes" && cross !== "no") {
      return alert('Please enter "yes" or "no" for crossing midnight.');
    }
    const startTime = new Date(`${editDate}T${editStart}`);
    let endTime = new Date(`${editDate}T${editEnd}`);

    if (startTime.getTime() === endTime.getTime()) {
      return alert("Start time and end time cannot be the same.");
    }
    if (endTime < startTime && cross === "no") {
      return alert(
        "End time is before start time. Fix the time or mark as crossing midnight."
      );
    }
    try {
      await setDoc(
        doc(db, "users", user.uid, "shifts", id),
        {
          date: editDate,
          start: editStart,
          end: editEnd,
          crossMidnight: cross,
        },
        { merge: true }
      );
      setEditingShiftId(null);
    } catch (err) {
      alert(err.message);
    }
  };
  const handleCancel = () => {
    setEditingShiftId(null);
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    if (!confirm("Are you sure you want to delete this shift?")) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "shifts", id));
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-6 text-[#0E4C58] dark:text-white">
        Edit Your Shifts
      </h2>

      {shifts.length === 0 && (
        <p className="text-center text-gray-500 py-6 dark:text-white">
          No shifts yet.
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 dark:text-white">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="p-5 rounded-2xl shadow-md border border-gray-100 bg-[#F5FBFB] dark:bg-gray-500 dark:border-gray-500"
          >
            {editingShiftId === shift.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1"
                />
                <div className="flex gap-2 items-center">
                  <input
                    type="time"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-24"
                  />
                </div>
                <input
                  type="text"
                  value={editCrossMidnight}
                  onChange={(e) => setEditCrossMidnight(e.target.value)}
                  placeholder="cross midnight? yes/no"
                  className="border border-gray-300 rounded px-2 py-1"
                />

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSave(shift.id)}
                    className="px-3 py-1 rounded-full bg-[#0E4C58] text-white hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 rounded-full bg-[#0E4C58] text-white hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-[#0E4C58]">
                  {shift.date}
                </span>
                <span>
                  {shift.start} – {shift.end} ({shiftHours(shift)} hrs)
                </span>
                <span className="text-sm capitalize">
                  Cross midnight: {shift.crossMidnight || "no"}
                </span>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(shift)}
                    className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(shift.id)}
                    className="px-3 py-1 rounded-full bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
