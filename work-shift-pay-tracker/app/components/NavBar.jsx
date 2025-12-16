/*"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 bg-teal-700 text-white">
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/shifts/add">Add Shift</Link>
      <Link href="/shifts/view">View Shifts</Link>
      <Link href="/settings">Settings</Link>
      <button onClick={() => signOut(auth)}>Logout</button>
    </nav>
  );
}*/