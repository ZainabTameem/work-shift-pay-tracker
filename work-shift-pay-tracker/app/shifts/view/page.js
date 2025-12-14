"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getShifts, deleteShift } from "../../lib/firestore";

export default function ViewShiftsPage() {
  const { user } = useAuth();
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    if (user) {
      getShifts(user.uid).then(setShifts);
    }
  }, [user]);

  const handleDelete = async (id) => {
    await deleteShift(user.uid, id);
    setShifts(shifts.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      {shifts.map((s) => (
        <div key={s.id} className="flex justify-between border p-2 mb-2">
          <span>{s.date} | {s.start} - {s.end}</span>
          <button onClick={() => handleDelete(s.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}