/**
 * Decorative SVG artwork for Ayura dashboard — soft botanical / wellness motifs.
 * Inline for performance; aria-hidden for screen readers.
 */

export function DoshaIllustrationVata({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="vata-g1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8b4b8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#c4a5c8" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="vata-g2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f5e0e4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#faf3f0" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="200" rx="120" ry="60" fill="url(#vata-g1)" transform="rotate(-12 200 200)" />
      <path
        d="M40 220 Q120 80 260 200"
        stroke="#b87a82"
        strokeWidth="1.25"
        strokeOpacity="0.35"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M60 180 Q140 40 280 160"
        stroke="#c49aa0"
        strokeWidth="1"
        strokeOpacity="0.28"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M180 40c-20 45-5 95 35 125M200 55c-35 30-45 80-25 120M165 70c15 50 55 85 95 95"
        stroke="#9d6b73"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeOpacity="0.4"
        fill="none"
      />
      <path
        d="M220 30c25 40 20 90-10 125M245 50c-15 55-50 95-95 110"
        stroke="#b87a82"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.32"
        fill="none"
      />
      <circle cx="95" cy="95" r="48" fill="url(#vata-g2)" />
      <path
        d="M75 95c8-18 28-28 45-22M88 108c12 8 28 6 38-4"
        stroke="#8b5a62"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.35"
        fill="none"
      />
    </svg>
  );
}

export function DoshaIllustrationPitta({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pitta-sun" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#f9d76c" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#f4b942" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f9d76c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="175" cy="120" r="100" fill="url(#pitta-sun)" />
      <circle cx="175" cy="120" r="36" fill="#f9d76c" fillOpacity="0.35" stroke="#c9a227" strokeOpacity="0.4" strokeWidth="1.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
        <line
          key={i}
          x1="175"
          y1="120"
          x2="175"
          y2="55"
          stroke="#e8b84a"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeLinecap="round"
          transform={`rotate(${deg} 175 120)`}
        />
      ))}
      <path
        d="M60 200 Q100 150 160 175 T260 165"
        stroke="#c9a227"
        strokeWidth="1.2"
        strokeOpacity="0.25"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M80 230 Q140 190 220 210"
        stroke="#e8b84a"
        strokeWidth="1"
        strokeOpacity="0.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DoshaIllustrationKapha({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="kapha-petal" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7aab8e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#b8d8c8" stopOpacity="0.25" />
        </linearGradient>
        <linearGradient id="kapha-ripple" x1="50%" y1="50%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#8cb8a8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#5a8f7a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="175" cy="210" rx="130" ry="45" fill="url(#kapha-ripple)" />
      <ellipse cx="175" cy="225" rx="100" ry="32" fill="url(#kapha-ripple)" opacity="0.7" />
      <g transform="translate(175 115)">
        {[0, 60, 120, 180, 240, 300].map((r, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="0"
            rx="28"
            ry="72"
            fill="url(#kapha-petal)"
            transform={`rotate(${r})`}
          />
        ))}
        <circle cx="0" cy="0" r="22" fill="#b8d8c8" fillOpacity="0.45" />
      </g>
      <path
        d="M50 100 Q90 60 130 90 T210 85"
        stroke="#6d9480"
        strokeWidth="1.2"
        strokeOpacity="0.3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M70 140 Q120 110 180 125 T270 118"
        stroke="#8cb8a8"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function DoshaIllustration({ doshaKey, className }) {
  const map = {
    vata: DoshaIllustrationVata,
    pitta: DoshaIllustrationPitta,
    kapha: DoshaIllustrationKapha,
  };
  const Cmp = map[doshaKey] || DoshaIllustrationVata;
  return <Cmp className={className || 'h-auto w-full'} />;
}

export function PantryStillLifeArt({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bowl" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff8f0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fde8d4" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="spice" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d97706" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <ellipse cx="120" cy="178" rx="88" ry="14" fill="#ca8a04" fillOpacity="0.12" />
      <path
        d="M48 120 Q120 95 192 120 L175 165 Q120 188 65 165 Z"
        fill="url(#bowl)"
        stroke="#d6a574"
        strokeWidth="1.25"
        strokeOpacity="0.45"
      />
      <ellipse cx="120" cy="128" rx="58" ry="22" fill="#fffdf8" fillOpacity="0.85" stroke="#e8c4a0" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="95" cy="125" r="8" fill="url(#spice)" />
      <circle cx="120" cy="118" r="6" fill="#f59e0b" fillOpacity="0.25" />
      <circle cx="145" cy="128" r="7" fill="#ea580c" fillOpacity="0.2" />
      <path d="M168 72l12 38M175 68l-8 42" stroke="#84a863" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.45" />
      <ellipse cx="175" cy="65" rx="14" ry="22" fill="#a3c293" fillOpacity="0.35" transform="rotate(-8 175 65)" />
      <path
        d="M52 88c12-8 24-4 32 6M40 102c18-6 32 4 38 18"
        stroke="#6b8f5e"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.35"
        fill="none"
      />
    </svg>
  );
}

export function ExploreArtLifestyle({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <path
        d="M85 85c-15-25-5-55 20-70M95 78c-8-20 2-42 22-52"
        stroke="#4d7c5a"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <path
        d="M20 78c18-35 45-50 72-48"
        stroke="#6b9b7a"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeOpacity="0.3"
      />
      <ellipse cx="38" cy="42" rx="22" ry="12" fill="#a8d4b8" fillOpacity="0.25" transform="rotate(-25 38 42)" />
      <ellipse cx="58" cy="32" rx="18" ry="10" fill="#7aab8e" fillOpacity="0.2" transform="rotate(15 58 32)" />
    </svg>
  );
}

export function ExploreArtFood({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <ellipse cx="60" cy="82" rx="44" ry="8" fill="#fb923c" fillOpacity="0.15" />
      <path
        d="M28 55 Q60 40 92 55 L82 78 Q60 88 38 78 Z"
        fill="#fff7ed"
        stroke="#fdba74"
        strokeWidth="1.2"
        strokeOpacity="0.5"
      />
      <circle cx="52" cy="58" r="5" fill="#fb923c" fillOpacity="0.2" />
      <circle cx="68" cy="62" r="4" fill="#f97316" fillOpacity="0.18" />
    </svg>
  );
}

export function ExploreArtSeasons({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <path
        d="M60 22v12M60 66v12M38 44l10 6M72 50l10-6M38 56l10-6M72 50l10 6"
        stroke="#38bdf8"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.35"
      />
      <circle cx="60" cy="50" r="18" fill="#e0f2fe" fillOpacity="0.5" stroke="#7dd3fc" strokeWidth="1" strokeOpacity="0.4" />
      <path d="M24 78 Q60 62 96 78" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function ExploreArtHabits({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 100" fill="none" aria-hidden="true">
      <circle cx="60" cy="48" r="22" stroke="#c4b5fd" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 6" fill="none" />
      <path d="M60 38v20M50 48h20" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.35" />
      <circle cx="60" cy="78" r="4" fill="#ddd6fe" fillOpacity="0.5" />
    </svg>
  );
}

export function BotanicalDivider({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 160 12" fill="none" aria-hidden="true">
      <path
        d="M0 6h52M108 6h52M58 6c8-4 16-4 22 0s14 4 22 0"
        stroke="#a8a29e"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SidebarLotusMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lotus-s" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6b8f5e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#a8c69a" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <g transform="translate(24 26)">
        {[0, 60, 120, 180, 240, 300].map((r, i) => (
          <ellipse key={i} cx="0" cy="0" rx="6" ry="16" fill="url(#lotus-s)" transform={`rotate(${r})`} />
        ))}
      </g>
    </svg>
  );
}
