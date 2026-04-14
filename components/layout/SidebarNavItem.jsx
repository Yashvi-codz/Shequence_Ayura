'use client';

import Link from 'next/link';

export default function SidebarNavItem({
  href,
  active,
  icon,
  label,
  collapsed,
  badge,
  onClick,
  onNavigate,
  disabled,
}) {
  const base =
    'group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-200';

  if (disabled) {
    return (
      <div
        className={`${base} cursor-not-allowed text-stone-400/90 opacity-80`}
        title={`${label} — coming soon`}
      >
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-stone-100/90 text-stone-500 ring-1 ring-stone-200/50">
          {icon}
        </span>
        {!collapsed && (
          <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <span className="truncate">{label}</span>
            {badge}
          </span>
        )}
      </div>
    );
  }

  const content = (
    <>
      {active ? (
        <span
          className="absolute left-0 top-1/2 hidden h-8 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500 shadow-sm md:block"
          aria-hidden="true"
        />
      ) : null}
      <span
        className={`relative z-[1] flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
          active
            ? 'bg-white text-emerald-800 shadow-md ring-1 ring-emerald-200/70'
            : 'bg-white/50 text-stone-600 ring-1 ring-stone-200/40 group-hover:bg-white group-hover:text-stone-800 group-hover:shadow-sm'
        }`}
      >
        {icon}
      </span>
      {!collapsed && (
        <span className="relative z-[1] flex min-w-0 flex-1 items-center justify-between gap-2">
          <span className={`truncate ${active ? 'font-semibold text-emerald-950' : 'text-stone-800'}`}>{label}</span>
          {badge}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} w-full text-left ${
          active
            ? 'bg-white/95 text-emerald-950 shadow-md ring-1 ring-emerald-200/50'
            : 'text-stone-600 hover:bg-white/70 hover:text-stone-900'
        }`}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      onClick={() => onNavigate?.()}
      className={`${base} ${
        active
          ? 'bg-white/95 text-emerald-950 shadow-md ring-1 ring-emerald-200/55'
          : 'text-stone-600 hover:bg-white/65 hover:text-stone-900 hover:shadow-sm'
      }`}
      title={collapsed ? label : undefined}
    >
      {content}
    </Link>
  );
}
