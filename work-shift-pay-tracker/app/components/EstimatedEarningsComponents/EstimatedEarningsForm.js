"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";


export default function EstimatedEarningsForm() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [overtimeWage, setOvertimeWage] = useState(0);
  const [shifts, setShifts] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [expandedWeek, setExpandedWeek] = useState(null);

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

  useEffect(() => {
    if (shifts.length === 0) return;

    const grouped = {};

    shifts.forEach((shift) => {
      const date = new Date(shift.date);
      const day = date.getDay();

      const monday = new Date(date);
      monday.setDate(date.getDate() - ((day + 6) % 7));

      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const weekLabel = `Week of ${monday.toDateString()} – ${sunday.toDateString()}`;

      const startM = getMinutes(shift.start);
      const endM = getMinutes(shift.end);

      let diff = endM - startM;
      if (diff < 0) diff += 24 * 60;

      const hours = diff / 60;

      const regular = Math.min(hours, 8);
      const overtime = Math.max(hours - 8, 0);

      if (!grouped[weekLabel]) {
        grouped[weekLabel] = {
          regular: 0,
          overtime: 0,
          weekLabel,
        };
      }

      grouped[weekLabel].regular += regular;
      grouped[weekLabel].overtime += overtime;
    });

    setWeeks(Object.values(grouped));
  }, [shifts]);

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-[#0E4C58] mb-6 dark:text-gray-300">
        Estimated Weekly Earnings
      </h1>

      {weeks.length === 0 ? (
        <p className="text-gray-500">No shifts recorded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          {weeks.map((week, index) => {
            const weekKey = `week-${index}`;
            const regularPay = week.regular * hourlyWage;
            const overtimePay = week.overtime * overtimeWage;
            const total = regularPay + overtimePay;

            return (
              <div
                key={index}
                className="bg-[#F1FAF8] p-5 rounded-xl shadow-md border  dark:bg-gray-500 dark:border-gray-500"
              >
                <h3 className="font-semibold text-lg mb-2">{week.weekLabel}</h3>
                <p>Regular Hours: <strong>{week.regular.toFixed(1)}</strong></p>
                <p>Overtime Hours: <strong>{week.overtime.toFixed(1)}</strong></p>
                <button
                  onClick={() =>
                    setExpandedWeek(expandedWeek === weekKey ? null : weekKey)
                  }
                  className="mt-4 px-4 py-2 bg-[#0E4C58] text-white rounded-full hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                >
                  {expandedWeek === weekKey
                    ? "Hide Earnings"
                    : "Calculate Earnings"}
                </button>
                {expandedWeek === weekKey && (
                  <div className="mt-4 bg-white p-4 rounded-lg border dark:bg-gray-800 dark:border-gray-800">
                    <p>
                      Regular: {week.regular.toFixed(1)} × ${hourlyWage} =
                      <strong> ${regularPay.toFixed(2)}</strong>
                    </p>
                    <p>
                      Overtime: {week.overtime.toFixed(1)} × ${overtimeWage} =
                      <strong> ${overtimePay.toFixed(2)}</strong>
                    </p>
                    <hr className="my-2" />
                    <p className="text-lg font-bold">
                      Total: ${total.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
