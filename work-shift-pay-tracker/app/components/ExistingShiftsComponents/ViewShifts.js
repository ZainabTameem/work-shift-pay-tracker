"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function ViewShifts() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [isEditingWage, setIsEditingWage] = useState(false);
  const [wageInput, setWageInput] = useState("");

  const [overtimeWage, setOvertimeWage] = useState(0);
  const [isEditingOvertime, setIsEditingOvertime] = useState(false);
  const [overtimeInput, setOvertimeInput] = useState("");

  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const shiftsRef = collection(userDocRef, "shifts");

    const unsubscribe = onSnapshot(shiftsRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setShifts(data);
    });

    (async () => {
      const snap = await getDoc(userDocRef);

      if (snap.exists() && snap.data().hourlyWage != null) {
        const wage = Number(snap.data().hourlyWage);
        setHourlyWage(wage);
        setWageInput(String(wage));
      } else {
        setHourlyWage(0);
        setWageInput("0");
      }

      if (snap.exists() && snap.data().overtimeWage != null) {
        const ot = Number(snap.data().overtimeWage);
        setOvertimeWage(ot);
        setOvertimeInput(String(ot));
      } else {
        setOvertimeWage(0);
        setOvertimeInput("0");
      }
    })();

    return () => unsubscribe();
  }, []);

  const getMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const shiftHours = (shift) => {
    const startM = getMinutes(shift.start);
    const endM = getMinutes(shift.end);

    let diff = endM - startM;

    if (diff < 0) diff += 24 * 60;

    return diff / 60;
  };

  const formatWeekLabel = (startDate, endDate) => {
    const startStr = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const yearStr = startDate.getFullYear();
    return `Week of ${startStr} – ${endStr}, ${yearStr}`;
  };

  const totalHours = useMemo(() => {
    if (!shifts.length) return 0;
    return shifts.reduce((sum, shift) => sum + shiftHours(shift), 0);
  }, [shifts]);

  const weeklySummaries = useMemo(() => {
    if (!shifts.length) return [];

    const sorted = [...shifts].sort((a, b) =>
      String(a.date).localeCompare(String(b.date))
    );

    const weekMap = new Map();

    sorted.forEach((shift) => {
      if (!shift.date) return;
      const [y, m, d] = shift.date.split("-").map(Number);
      const dateObj = new Date(y, m - 1, d); 

      if (isNaN(dateObj.getTime())) return;

      const day = dateObj.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(dateObj);
      monday.setDate(dateObj.getDate() - diffToMonday);

      const key = monday.toISOString().slice(0, 10);

      if (!weekMap.has(key)) {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        weekMap.set(key, {
          start: monday,
          end: sunday,
          shifts: [],
          hours: 0,
        });
      }

      const week = weekMap.get(key);
      week.shifts.push(shift);
      week.hours += shiftHours(shift);
    });

    const arr = Array.from(weekMap.values()).sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );


    return arr;
  }, [shifts]);

  const handleSaveWage = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const parsed = Number(wageInput);
    if (Number.isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid hourly wage.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { hourlyWage: parsed },
        { merge: true }
      );
      setHourlyWage(parsed);
      setIsEditingWage(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveOvertime = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const parsed = Number(overtimeInput);
    if (Number.isNaN(parsed) || parsed < 0) {
      alert("Please enter a valid overtime wage.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { overtimeWage: parsed },
        { merge: true }
      );
      setOvertimeWage(parsed);
      setIsEditingOvertime(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white shadow-md p-6 rounded-xl dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-6 text-[#0E4C58] dark:text-white">
        Your Shifts
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col items-center dark:bg-gray-500 dark:border-gray-500">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2 dark:text-white">
            Total Hours Worked
          </p>
          <p className="text-5xl font-bold text-[#0E4C58]">
            {totalHours.toFixed(1)}
          </p>
          <p className="text-xs text-gray-400 mt-1 dark:text-white">
            Based on recorded shifts
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col dark:bg-gray-500 dark:border-gray-500">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2 dark:text-white">
            Hourly Wage
          </p>

          {!isEditingWage ? (
            <div className="flex items-center justify-between">
              <p className="text-4xl font-semibold text-[#0E4C58]">
                ${hourlyWage.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => setIsEditingWage(true)}
                className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                min="0"
                value={wageInput}
                onChange={(e) => setWageInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0E4C58]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingWage(false);
                    setWageInput(String(hourlyWage));
                  }}
                  className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveWage}
                  className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 flex flex-col dark:bg-gray-500 dark:border-gray-500">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2  dark:text-white">
            Overtime Hourly Wage
          </p>

          {!isEditingOvertime ? (
            <div className="flex items-center justify-between">
              <p className="text-4xl font-semibold text-[#0E4C58]">
                ${overtimeWage.toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => setIsEditingOvertime(true)}
                className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <input
                type="number"
                step="0.01"
                min="0"
                value={overtimeInput}
                onChange={(e) => setOvertimeInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#0E4C58]"
              />
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingOvertime(false);
                    setOvertimeInput(String(overtimeWage));
                  }}
                  className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveOvertime}
                  className="px-3 py-1 rounded-full bg-[#0E4C58] text-white  hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {weeklySummaries.length === 0 ? (
        <p className="text-center text-gray-500 py-6  dark:text-white">
          No shifts added yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {weeklySummaries.map((week) => (
            <div
              key={week.start.toISOString()}
              className="bg-[#F5FBFB] border border-gray-100 rounded-2xl p-5 shadow-sm dark:bg-gray-400 dark:border-gray-400"
            >
              <p className="text-sm font-semibold text-[#0E4C58] mb-1">
                {formatWeekLabel(week.start, week.end)}
              </p>
              <p className="text-sm text-gray-600 dark:text-white">
                Shifts:{" "}
                <span className="font-semibold">{week.shifts.length}</span>
              </p>
              <p className="text-sm text-gray-600 mt-1 dark:text-white">
                Hours:{" "}
                <span className="font-semibold">
                  {week.hours.toFixed(1)} hours
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}