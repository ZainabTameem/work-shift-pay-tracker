"use client";

import { useEffect, useState, useMemo } from "react";
import { auth, db } from "../../../lib/firebase";
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

}