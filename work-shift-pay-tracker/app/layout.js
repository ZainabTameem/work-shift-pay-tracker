import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../public/Logo.svg';

export const metadata = {
  title: 'Workly',
  description: 'Work Shift & Pay Tracker',
};

export default function RootLayout({ children }) {
  return (
    <body className="bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

          <Link href="/">
            <div className="flex items-center space-x-2">
              <Image
                src={Logo}
                alt="Workly Logo"
                width={200}
                height={200}
              />
            </div>
          </Link>

          <nav className="space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/signup"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        {children}
      </main>
    </body>
  );
}