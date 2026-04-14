import { BotanicalDivider } from './wellnessArt';

export default function SectionHeader({ eyebrow, title, description, className = '' }) {
  return (
    <div className={`max-w-4xl ${className}`}>
      {eyebrow ? (
        <div className="mb-3 flex items-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-stone-300/80" aria-hidden="true" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">{eyebrow}</p>
          <BotanicalDivider className="hidden h-3 w-24 opacity-60 sm:block" />
        </div>
      ) : null}
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl lg:text-[2rem] lg:leading-snug">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 max-w-2xl border-l-2 border-amber-200/50 pl-4 text-sm leading-relaxed text-stone-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
