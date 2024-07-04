// src/components/Layout.tsx
import React, { ReactNode } from "react";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../Navbar";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "My App" }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <header className="p-4">
        <nav className="px-16 py-6 flex justify-between items-center h-[88px]">
          <Link href="/">
            <Image
              src="/images/logo.svg"
              alt="Jambo Hotel Logo"
              width={256}
              height={40}
            />
          </Link>
          <Navbar />
          <div className="flex space-x-4">
            <Link
              href="/signup-agent"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
            >
              Signup as Agent
            </Link>
            <Link
              href="/signup-hotel"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded"
            >
              Signup as Hotel
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-grow max-w-[1920px]">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2024 My App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
