"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../lib/firebase";
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [userEmail, setUserEmail] = useState("");
  const [hourlyWage, setHourlyWage] = useState(0);
  const [editingWage, setEditingWage] = useState(false);
  const [wageInput, setWageInput] = useState("");

  const [shifts, setShifts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const loadData = async () => {
      setUserEmail(user.email || "");

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        const wage = Number(data.hourlyWage || 0);
        setHourlyWage(wage);
        setWageInput(String(wage));
      }

      const shiftsRef = collection(userRef, "shifts");
      const snap = await getDocs(shiftsRef);
      setShifts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    loadData();
  }, []);

  const calculateShiftHours = (shift) => {
    if (!shift.start || !shift.end) return 0;

    const [sh, sm] = shift.start.split(":").map(Number);
    const [eh, em] = shift.end.split(":").map(Number);

    let start = sh * 60 + sm;
    let end = eh * 60 + em;

    if (end < start) end += 24 * 60;

    return (end - start) / 60;
  };

  const totalHours = useMemo(() => {
    return shifts.reduce((sum, shift) => sum + calculateShiftHours(shift), 0);
  }, [shifts]);

  const estimatedEarnings = useMemo(() => {
    return totalHours * hourlyWage;
  }, [totalHours, hourlyWage]);

  const saveWage = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const parsed = Number(wageInput);
    if (isNaN(parsed) || parsed < 0) return alert("Enter valid wage.");

    await updateDoc(doc(db, "users", user.uid), { hourlyWage: parsed });
    setHourlyWage(parsed);
    setEditingWage(false);
  };

  const logout = async () => {
    await auth.signOut();
    router.push("/auth/login");
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF();

    pdf.setFontSize(18);
    pdf.text("Work Summary Report", 14, 20);

    pdf.setFontSize(12);
    pdf.text(`Email: ${userEmail}`, 14, 35);
    pdf.text(`Hourly Wage: $${hourlyWage}`, 14, 42);
    pdf.text(`Total Hours: ${totalHours.toFixed(2)}`, 14, 49);
    pdf.text(
      `Estimated Earnings: $${estimatedEarnings.toFixed(2)}`,
      14,
      56
    );

    const rows = shifts.map((s) => [s.date, s.start, s.end, s.notes || "—"]);

    autoTable(pdf, {
      startY: 70,
      head: [["Date", "Start", "End", "Notes"]],
      body: rows,
      headStyles: { fillColor: [14, 76, 88] },
    });

    pdf.save("work_summary.pdf");
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-10 dark:bg-gray-500 dark:border-gray-500">
      <h2 className="text-2xl font-semibold text-[#0E4C58] mb-6 text-center">
        Profile Information
      </h2>

      <div className="mb-6">
        <p className="text-sm text-gray-500  dark:text-white">Email</p>
        <p className="text-lg font-medium">{userEmail}</p>
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-500  dark:text-white">Total Hours Worked</p>
        <p className="text-4xl font-bold text-[#0E4C58]">
          {totalHours.toFixed(1)}
        </p>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-500  dark:text-white">Hourly Wage</p>

        {!editingWage ? (
          <div className="flex items-center justify-between mt-1">
            <p className="text-xl font-semibold">${hourlyWage}</p>
            <button
              onClick={() => setEditingWage(true)}
              className="px-3 py-1 rounded-full bg-[#0E4C58] text-white hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex gap-3 mt-2">
            <input
              type="number"
              value={wageInput}
              onChange={(e) => setWageInput(e.target.value)}
              className="border p-2 rounded w-32"
            />
            <button
              onClick={saveWage}
              className="bg-[#0E4C58] text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditingWage(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button
        onClick={downloadPDF}
        className="w-full bg-[#0E4C58] text-white py-3 rounded-xl shadow mb-4 hover:bg-gray-400 transition hover:text-[#0E4C58] dark:text-white dark:border-[#0E4C58] dark:hover:bg-gray-300 dark:hover:text-[#0E4C58]"
      >
        Download Work Summary (PDF)
      </button>

      <button
        onClick={logout}
        className="w-full bg-red-500 text-white py-3 rounded-xl shadow hover:bg-red-600"
      >
        Log Out
      </button>
    </div>
  );
}