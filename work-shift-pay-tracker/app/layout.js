
"use client";

import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <AuthProvider>
          <PageContent>{children}</PageContent>
        </AuthProvider>
      </body>
    </html>
  );
}

function PageContent({ children }) {
  const pathname = usePathname();

  // Hide navbar ONLY on landing page "/"
  const hideNavbar = pathname === "/" || pathname.startsWith("/auth");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
