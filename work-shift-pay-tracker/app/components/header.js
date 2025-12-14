"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-[#DDFCE7] w-full py-4 px-6 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo on the left */}
        <Image
          src="/Logo.svg"
          alt="Logo"
          width={200}
          height={200}
        />

        {/* Text aligned to the right */}
        <span className="text-xl text-slate-700 font-abereto mb-2">
          Pay & Shift Tracker
        </span>

      </div>
    </header>
  );
}
