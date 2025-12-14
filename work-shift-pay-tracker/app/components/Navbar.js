"use client";

import Link from "next/link";

export default function Navbar() {
  const menuItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Manage Existing Shifts", href: "/shifts" },
    { name: "Estimated Earnings", href: "/earnings" },
    { name: "Settings", href: "/settings" },
    { name: "Profile", href: "/profile" },
  ];

  return (
    <nav className="bg-[#0E4C58] w-full shadow-md mt-4 rounded-[10px] overflow-x-auto">
      <ul className="flex justify-center items-center py-2 px-2 whitespace-nowrap gap-x-6">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.href}
              className="inline-block text-white font-semibold px-4 py-2 rounded-[5px] transition duration-200 hover:bg-white hover:text-[#0E4C58]"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}



