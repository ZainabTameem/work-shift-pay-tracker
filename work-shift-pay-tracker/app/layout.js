"use client";

import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/header";
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

  const hideHeader = pathname === "/"; // hide header on root page
  const hideNavbar = pathname === "/" || pathname.startsWith("/auth"); // hide navbar on root and auth pages

  return (
    <>
      {/* Fixed Header (visible on all pages except root) */}
      {!hideHeader && (
        <div className="fixed top-0 left-0 w-full">
          <Header />

          {/* Fixed Navbar (only on non-auth pages) */}
          {!hideNavbar && (
            <div className="w-full max-w-6xl mx-auto mt-4 px-4">
              <Navbar />
            </div>
          )}
        </div>
      )}

      {/* Main page content */}
      <main
        className={`mx-auto max-w-6xl px-4 py-8 ${!hideHeader
          ? !hideNavbar
            ? "pt-[128px]" // header + navbar
            : "pt-[64px]" // header only
          : "" // root page, no header/navbar
          }`}
      >
        {children}
      </main>
    </>
  );
}
