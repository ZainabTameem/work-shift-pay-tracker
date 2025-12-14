"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";


export default function EstimatedEarningsForm() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [overtimeWage, setOvertimeWage] = useState(0);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);

    (async () => {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setHourlyWage(snap.data().hourlyWage || 0);
        setOvertimeWage(snap.data().overtimeWage || 0);
      }
    })();
  }, []);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const shiftsRef = collection(doc(db, "users", user.uid), "shifts");

    const unsubscribe = onSnapshot(shiftsRef, (snapshot) => {
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

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-[#0E4C58] mb-6">
        Estimated Weekly Earnings
      </h1>

      <p className="text-gray-500">
        Weekly earnings will be calculated here.
      </p>
    </div>
  );
}
