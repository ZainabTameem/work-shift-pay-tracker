"use client";

import { useEffect, useState } from "react";
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

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-6 text-[#0E4C58]">
        Your Shifts
      </h2>

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
