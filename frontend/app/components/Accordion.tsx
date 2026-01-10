'use client';

import { useState } from 'react';

export function Accordion({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border p-4">
      <button onClick={() => setOpen(!open)}>
        {title}
      </button>
      {open && <div className="mt-2">{children}</div>}
    </div>
  );
}

