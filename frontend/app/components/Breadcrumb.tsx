export function Breadcrumb({ path }: { path: string[] }) {
  return (
    <nav className="text-sm">
      {path.join(' / ')}
    </nav>
  );
}

