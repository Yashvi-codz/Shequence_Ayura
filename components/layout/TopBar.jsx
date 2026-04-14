'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { IconMenu } from './icons';

export default function TopBar({ onMenuClick, title }) {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (!raw) return;
      const u = JSON.parse(raw);
      if (u?.name) setUserName(u.name);
    } catch {
      /* ignore */
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove('token');
    localStorage.clear();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/45 bg-gradient-to-r from-[#fdfbf7]/95 via-[#faf7f2]/95 to-[#f8f4ed]/95 shadow-[0_1px_0_rgba(255,255,255,0.8)_inset] backdrop-blur-md">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgb(120 100 80), transparent 45%), radial-gradient(circle at 80% 30%, rgb(180 140 100), transparent 40%)`,
        }}
      />
      <div className="relative flex h-[3.65rem] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-stone-200/70 bg-white/90 text-stone-700 shadow-sm transition hover:border-emerald-200/60 hover:bg-white md:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold tracking-tight text-stone-900 sm:text-lg">{title || 'Ayura'}</h1>
            {userName ? (
              <p className="truncate text-xs text-stone-500 sm:text-sm">
                <span className="text-stone-400">Signed in as</span> {userName}
              </p>
            ) : (
              <p className="hidden text-xs text-stone-500 sm:block">Your wellness command center</p>
            )}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-xl border border-stone-200/80 bg-white/90 px-3.5 py-2 text-sm font-medium text-stone-700 shadow-sm transition hover:border-amber-300/50 hover:bg-gradient-to-b hover:from-white hover:to-amber-50/40 hover:text-stone-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
