'use client';

import { useState } from 'react';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="p-4 border-b">
      <button
        className="text-xl"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <ul className="mt-4 space-y-2">
          <li><a href="/">Home</a></li>
          <li><a href="/posts">Posts</a></li>
        </ul>
      )}
    </nav>
  );
}

