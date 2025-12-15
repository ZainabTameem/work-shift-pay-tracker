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
}