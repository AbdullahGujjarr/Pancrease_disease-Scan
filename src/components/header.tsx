import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="py-4 px-6 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary">
          <Stethoscope className="h-8 w-8" />
          <span>Pancreas Vision</span>
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
