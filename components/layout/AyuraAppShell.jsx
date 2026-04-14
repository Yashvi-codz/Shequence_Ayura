'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const NO_SHELL_PATHS = ['/app/quiz', '/app/profile/create', '/app/results'];

function pathUsesShell(pathname) {
  if (!pathname) return true;
  return !NO_SHELL_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

const COLLAPSE_KEY = 'ayura-sidebar-collapsed';

export default function AyuraAppShell({ children }) {
  const pathname = usePathname() || '';
  const showShell = useMemo(() => pathUsesShell(pathname), [pathname]);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(COLLAPSE_KEY);
      if (v === '1') setCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const onToggleCollapse = useCallback(() => {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/app/dashboard')) return 'Dashboard';
    if (pathname.startsWith('/app/pantry')) return 'Pantry Generator';
    if (pathname.startsWith('/app/logs')) return 'Daily Logs';
    if (pathname.startsWith('/app/food-checker')) return 'Food Combinations';
    if (pathname.startsWith('/app/lifestyle')) return 'Lifestyle & Mind';
    if (pathname.startsWith('/app/food')) return 'Food & Digestion';
    if (pathname.startsWith('/app/seasons')) return 'Seasons';
    if (pathname.startsWith('/app/meals')) return 'Meal planner';
    if (pathname.startsWith('/app/recipes')) return 'Recipes';
    if (pathname.startsWith('/app/chat')) return 'AI guidance';
    if (pathname.startsWith('/app/learn')) return 'Learn';
    if (pathname.startsWith('/app/profile')) return 'Profile';
    return 'Ayura';
  }, [pathname]);

  if (!showShell) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-[#f0ebe3] text-stone-800">
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-sm md:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col md:pl-0">
        <TopBar onMenuClick={() => setMobileOpen(true)} title={pageTitle} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
