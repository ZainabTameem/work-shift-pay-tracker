"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";


export default function EstimatedEarningsForm() {
  const [hourlyWage, setHourlyWage] = useState(0);
  const [overtimeWage, setOvertimeWage] = useState(0);
  const [shifts, setShifts] = useState([]);
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-[#0E4C58] mb-6">
        Estimated Weekly Earnings
      </h1>
    </div>
  );
}
