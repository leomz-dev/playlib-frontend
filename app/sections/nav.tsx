'use client';

import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="font-bold text-xl">GameLib</Link>
        <div>
          <Link href="#biblioteca" className="mr-4">Biblioteca</Link>
          <Link href="#dashboard">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}
