import React from 'react';
import { Home, Zap, Activity, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function MobileLayout({ children, title = "Mecânica da Mente" }: MobileLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Zap, label: 'Turbo', href: '/turbo' },
    { icon: Activity, label: 'Scanner', href: '/scanner' },
    // { icon: User, label: 'Perfil', href: '/profile' },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Header */}
      <header className="h-14 flex items-center justify-center border-b border-border bg-card/50 backdrop-blur-md z-10 shrink-0">
        <h1 className="text-lg font-bold text-primary tracking-wider uppercase">{title}</h1>
      </header>

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="h-16 border-t border-border bg-card fixed bottom-0 left-0 right-0 z-10 flex items-center justify-around pb-safe">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
