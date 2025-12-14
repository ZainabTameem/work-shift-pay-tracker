"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";

export default function ViewShifts() {
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const ref = collection(doc(db, "users", user.uid), "shifts");

    // real-time listener
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setShifts(data);
    });

    return () => unsubscribe();
  }, []);

    const getMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const totalHours = useMemo(() => {
    if (!shifts.length) return 0;

    return shifts.reduce((sum, shift) => {
      const startM = getMinutes(shift.start);
      const endM = getMinutes(shift.end);

      let diff = endM - startM;
      if (diff < 0) diff += 24 * 60;

      return sum + diff / 60;
    }, 0);
  }, [shifts]);

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl fsont-semibold mb-6 text-[#0E4C58]">
        Your Shifts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col items-center">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
            Total Hours Worked
          </p>
          <p className="text-5xl font-bold text-[#0E4C58]">
            {totalHours.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Based on recorded shifts
          </p>
        </div>
      </div>

      {shifts.length === 0 ? (
        <p className="text-center text-gray-500 py-6">
          No shifts added yet.
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0E4C58] text-white text-left">
              <th className="p-3">Date</th>
              <th className="p-3">Start Time</th>
              <th className="p-3">End Time</th>
              <th className="p-3">Notes</th>
            </tr>
          </thead>

          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{shift.date}</td>
                <td className="p-3">{shift.start}</td>
                <td className="p-3">{shift.end}</td>
                <td className="p-3">{shift.notes || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
