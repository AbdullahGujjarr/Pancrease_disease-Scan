import { Stethoscope, Activity, ShieldAlert, Ribbon, Info, ScanLine } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Scan', icon: ScanLine },
  { href: '/pancreatic-cancer', label: 'Pancreatic Cancer', icon: Ribbon },
  { href: '/chronic-pancreatitis', label: 'Chronic Pancreatitis', icon: Activity },
  { href: '/pancreatic-cysts', label: 'Pancreatic Cysts', icon: Info },
  { href: '/acute-pancreatitis', label: 'Acute Pancreatitis', icon: ShieldAlert },
  { href: '/prevention', label: 'Prevention', icon: Activity },
];

export function Header() {
  const pathname = usePathname(); // Get current path

  return (
    <header className="py-4 px-6 border-b sticky top-0 bg-background/95 backdrop-blur z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-semibold text-primary mb-4 md:mb-0">
          <Stethoscope className="h-8 w-8" />
          <span>Pancreas Vision</span>
        </Link>
        <nav>
          <ul className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 md:gap-x-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary font-semibold" : "text-foreground/70"
                  )}
                >
                  <item.icon className="inline-block h-4 w-4 mr-1 md:hidden" /> {/* Show icon on mobile */}
                  <span className="hidden md:inline">{item.label}</span> {/* Show label on desktop */}
                  <span className="md:hidden">{item.label.split(' ')[0]}</span> {/* Show first word on mobile for brevity */}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
