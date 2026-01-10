'use client';

import { useState, ReactNode } from 'react';

interface AccordionProps {
  title: string;
  children: ReactNode;
}

export function Accordion({ title, children }: AccordionProps) {
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
