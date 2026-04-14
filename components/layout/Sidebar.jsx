'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SidebarNavItem from './SidebarNavItem';
import {
  IconDashboard,
  IconPantry,
  IconLogs,
  IconFork,
  IconLeaf,
  IconBowl,
  IconSeason,
  IconHabits,
  IconChevronLeft,
  IconChevronRight,
} from './icons';
import { SidebarLotusMark } from '@/components/dashboard/wellnessArt';

const soonBadge = (
  <span className="rounded-full bg-stone-200/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-600 ring-1 ring-stone-300/40">
    Soon
  </span>
);

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const pathname = usePathname() || '';

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const asideClass = [
    'fixed inset-y-0 left-0 z-50 flex h-full flex-col border-r border-stone-200/50 bg-gradient-to-b from-[#faf7f0] via-[#f3ede3] to-[#ebe4d8] shadow-[4px_0_32px_-12px_rgba(60,45,30,0.12)] backdrop-blur-md transition-[transform,width] duration-300 ease-out md:static md:translate-x-0',
    collapsed ? 'md:w-[84px]' : 'md:w-[268px]',
    mobileOpen ? 'w-[288px] translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
  ].join(' ');

  return (
    <aside className={asideClass} aria-label="Main navigation">
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-1/4 -translate-y-1/4 rounded-full bg-emerald-200/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-0 h-32 w-32 -translate-x-1/3 rounded-full bg-amber-200/10 blur-2xl" />

      <div className="relative flex h-full min-h-0 flex-col px-3 pb-4 pt-5">
        <div className={`mb-5 flex items-center gap-2 ${collapsed ? 'md:justify-center md:px-0' : ''}`}>
          <Link
            href="/app/dashboard"
            onClick={onCloseMobile}
            className="group flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/50 bg-white/40 p-2 shadow-sm ring-1 ring-stone-200/30 backdrop-blur-sm transition hover:border-emerald-200/40 hover:bg-white/55 hover:shadow-md md:min-w-0"
          >
            <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-xl shadow-md ring-2 ring-white/90">
              <img src="/img/Logo.jpeg" alt="" className="h-full w-full object-cover" width={44} height={44} />
              <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-stone-900/5" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1 text-left">
                <div className="font-semibold tracking-tight text-stone-900">Ayura</div>
                <div className="text-[11px] font-medium leading-tight text-stone-500">Shequence Ayura</div>
              </div>
            )}
            {!collapsed && (
              <SidebarLotusMark className="h-9 w-9 flex-shrink-0 text-emerald-800/30 opacity-80 transition group-hover:opacity-100" />
            )}
          </Link>
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-stone-200/70 bg-white/85 text-stone-600 shadow-sm transition hover:bg-white hover:text-stone-900 md:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto pr-0.5">
          <p
            className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400/90 ${collapsed ? 'md:hidden' : ''}`}
          >
            Main
          </p>
          <SidebarNavItem
            href="/app/dashboard"
            active={isActive('/app/dashboard')}
            icon={<IconDashboard />}
            label="Dashboard"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            href="/app/pantry"
            active={isActive('/app/pantry')}
            icon={<IconPantry />}
            label="Pantry Generator"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            href="/app/logs"
            active={isActive('/app/logs')}
            icon={<IconLogs />}
            label="Daily Logs"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            href="/app/food-checker"
            active={isActive('/app/food-checker')}
            icon={<IconFork />}
            label="Food Combinations"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />

          <p
            className={`mb-2 mt-6 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400/90 ${collapsed ? 'md:hidden' : ''}`}
          >
            Explore
          </p>
          <SidebarNavItem
            href="/app/lifestyle"
            active={isActive('/app/lifestyle')}
            icon={<IconLeaf />}
            label="Lifestyle & Mind"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            href="/app/food"
            active={isActive('/app/food')}
            icon={<IconBowl />}
            label="Food & Digestion"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            href="/app/seasons"
            active={isActive('/app/seasons')}
            icon={<IconSeason />}
            label="Seasons"
            collapsed={collapsed}
            onNavigate={onCloseMobile}
          />
          <SidebarNavItem
            disabled
            icon={<IconHabits />}
            label="Habits"
            collapsed={collapsed}
            badge={!collapsed ? soonBadge : null}
          />
        </nav>

        <div
          className={`mt-4 space-y-0.5 border-t border-stone-200/60 pt-4 ${collapsed ? 'md:px-0' : ''}`}
        >
          {!collapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-400/90">More</p>
          )}
          <Link
            href="/app/recipes"
            onClick={onCloseMobile}
            className={`block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-white/65 hover:text-stone-900 hover:shadow-sm ${collapsed ? 'md:hidden' : ''}`}
          >
            Recipe matches
          </Link>
          <Link
            href="/app/meals"
            onClick={onCloseMobile}
            className={`block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-white/65 hover:text-stone-900 hover:shadow-sm ${collapsed ? 'md:hidden' : ''}`}
          >
            Meal planner
          </Link>
          <Link
            href="/app/chat"
            onClick={onCloseMobile}
            className={`block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-white/65 hover:text-stone-900 hover:shadow-sm ${collapsed ? 'md:hidden' : ''}`}
          >
            AI guidance
          </Link>
          <Link
            href="/app/learn"
            onClick={onCloseMobile}
            className={`block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-white/65 hover:text-stone-900 hover:shadow-sm ${collapsed ? 'md:hidden' : ''}`}
          >
            Learn
          </Link>
          <Link
            href="/app/profile"
            onClick={onCloseMobile}
            className={`block rounded-xl px-3 py-2 text-sm text-stone-600 transition hover:bg-white/65 hover:text-stone-900 hover:shadow-sm ${collapsed ? 'md:hidden' : ''}`}
          >
            Profile
          </Link>
        </div>
      </div>
    </aside>
  );
}
