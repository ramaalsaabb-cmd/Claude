import Image from "next/image";

export type CoverTheme = {
  accent?: string;
  coverBackground?: string;
  coverInk?: string;
  motif?: "dunes" | "rings" | "poster" | "stripes" | "grid" | "wireframe" | "signal" | "default";
};

type Props = {
  title: string;
  titleAr?: string;
  cover: { src: string; alt: string } | null;
  theme?: CoverTheme;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** "cover" crops to fill (cards); "contain" shows the whole image (posters, heroes). */
  fit?: "cover" | "contain";
  /** Draw the title on the generated cover (off inside cards, where the title is already shown). */
  showTitle?: boolean;
};

/**
 * Shows the real project cover when one exists. Otherwise renders a designed
 * typographic cover (clearly graphic, never imitating project media).
 */
export default function ProjectCover({ title, titleAr, cover, theme, sizes, priority, className = "", fit = "cover", showTitle = true }: Props) {
  if (cover) {
    return (
      <div className={`relative h-full w-full overflow-hidden bg-sand ${className}`}>
        {fit === "contain" && (
          <Image src={cover.src} alt="" aria-hidden="true" fill sizes="10vw" className="scale-110 object-cover opacity-40 blur-2xl" />
        )}
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`${fit === "contain" ? "object-contain" : "object-cover"} transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.05]`}
        />
      </div>
    );
  }

  const bg = theme?.coverBackground ?? "#E8DDD2";
  const ink = theme?.coverInk ?? "#1E1B1B";
  const accent = theme?.accent ?? "#882A2A";
  const motif = theme?.motif ?? "default";

  return (
    <div
      role="img"
      aria-label={title}
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ background: bg, color: ink }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
      >
        <Motif motif={motif} ink={ink} accent={accent} />
      </svg>
      {showTitle && (
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 sm:p-10">
        <span className="max-w-[60%] font-serif-latin text-4xl leading-none tracking-wide sm:text-6xl" lang="en">
          {title}
        </span>
        {titleAr && titleAr !== title && (
          <span className="max-w-[40%] text-end font-display-ar text-2xl leading-snug opacity-80 sm:text-4xl" lang="ar">
            {titleAr}
          </span>
        )}
      </div>
      )}
    </div>
  );
}

function Motif({ motif, ink, accent }: { motif: NonNullable<CoverTheme["motif"]>; ink: string; accent: string }) {
  switch (motif) {
    case "dunes":
      return (
        <g fill="none" strokeLinecap="round">
          {Array.from({ length: 9 }).map((_, i) => (
            <path
              key={i}
              d={`M-20 ${120 + i * 18} C 60 ${90 + i * 18}, 120 ${150 + i * 18}, 200 ${120 + i * 18} S 340 ${96 + i * 18}, 420 ${128 + i * 18}`}
              stroke={ink}
              strokeOpacity={0.12 + i * 0.03}
              strokeWidth="1.2"
            />
          ))}
          <circle cx="300" cy="70" r="26" fill={accent} fillOpacity="0.85" />
        </g>
      );
    case "rings":
      return (
        <g fill="none">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="290" cy="110" r={18 + i * 22} stroke={ink} strokeOpacity={0.22 - i * 0.022} strokeWidth="1" />
          ))}
          <path d="M290 110 L 420 40" stroke={accent} strokeWidth="1.4" />
          <circle cx="290" cy="110" r="5" fill={accent} />
          <path d="M40 60 h40 M40 70 h24 M40 80 h32" stroke={ink} strokeOpacity="0.3" strokeWidth="1" />
        </g>
      );
    case "poster":
      return (
        <g>
          <rect x="24" y="22" width="352" height="256" fill="none" stroke={ink} strokeOpacity="0.25" />
          <text x="200" y="128" textAnchor="middle" fontFamily="Georgia, serif" fontSize="64" fontStyle="italic" fill={accent} letterSpacing="2">
            Deadline
          </text>
          <path
            transform="translate(300 150) scale(0.9)"
            fill={ink}
            d="M20 22 L 18 4 L 28 14 C 30 13.5, 34 13.5, 36 14 L 46 4 L 44 22 C 47 26, 47 32, 43 36 C 50 44, 52 56, 50 70 C 56 70, 62 66, 62 58 C 62 54, 58 52, 58 48 C 58 46, 61 46, 62 48 C 66 54, 66 74, 50 76 L 18 76 C 12 76, 12 70, 16 66 C 14 56, 14 44, 21 36 C 17 32, 17 26, 20 22 Z"
          />
        </g>
      );
    case "stripes":
      return (
        <g>
          {["#7FA7E0", "#F2A7C3", "#A88BD8", "#FFFFFF"].map((c, i) => (
            <rect key={c} x={-40 + i * 70} y="-40" width="44" height="420" fill={c} fillOpacity="0.85" transform="rotate(18 200 150)" />
          ))}
          <rect x="230" y="60" width="120" height="84" rx="16" fill="#fff" fillOpacity="0.75" />
          <circle cx="290" cy="102" r="26" fill="none" stroke={ink} strokeOpacity="0.6" strokeWidth="2" />
          <circle cx="290" cy="102" r="12" fill={ink} fillOpacity="0.5" />
        </g>
      );
    case "grid":
      return (
        <g fill="none" stroke={ink} strokeWidth="0.8">
          {Array.from({ length: 12 }).map((_, i) => (
            <path key={`h${i}`} d={`M0 ${i * 28} H400`} strokeOpacity="0.12" />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <path key={`v${i}`} d={`M${i * 28} 0 V300`} strokeOpacity="0.12" />
          ))}
          <path d="M60 200 h80 v-60 h70 v40 h90" stroke={accent} strokeWidth="1.6" />
          {[60, 140, 210, 300].map((x, i) => (
            <circle key={x} cx={x} cy={[200, 140, 180, 180][i]} r="4" fill={accent} stroke="none" />
          ))}
        </g>
      );
    case "wireframe":
      return (
        <g fill="none" stroke={ink} strokeWidth="1" strokeLinejoin="round">
          <path d="M180 190 L 240 160 L 300 190 L 300 250 L 240 280 L 180 250 Z" strokeOpacity="0.5" />
          <path d="M180 190 L 240 220 L 300 190 M240 220 V 280" strokeOpacity="0.5" />
          <path d="M170 192 L 240 120 L 310 192" stroke={accent} strokeWidth="1.6" />
          <path d="M240 120 L 240 160" strokeOpacity="0.3" />
          <path d="M120 210 L 160 190 L 200 210 L 200 250 L 160 270 L 120 250 Z" strokeOpacity="0.35" />
          <path d="M112 212 L 160 170 L 208 212" stroke={accent} strokeOpacity="0.8" />
        </g>
      );
    case "signal":
      return (
        <g fill="none" strokeLinecap="round">
          {[30, 58, 86, 114].map((r, i) => (
            <path key={r} d={`M${290 - r} ${150 - r * 0.2} A ${r} ${r} 0 0 1 ${290 + r} ${150 - r * 0.2}`} stroke={i === 1 ? accent : ink} strokeOpacity={i === 1 ? 1 : 0.35 - i * 0.05} strokeWidth="1.4" />
          ))}
          <rect x="272" y="150" width="36" height="64" rx="8" stroke={ink} strokeOpacity="0.7" strokeWidth="1.4" />
          <path d="M284 204 h12" stroke={ink} strokeOpacity="0.7" strokeWidth="1.4" />
          <path d="M60 80 h70 M60 92 h46 M60 104 h58" stroke={ink} strokeOpacity="0.25" />
          <path d="M60 130 l12 12 l22 -24" stroke={accent} strokeWidth="2" />
        </g>
      );
    default:
      return <circle cx="300" cy="90" r="40" fill={accent} fillOpacity="0.8" />;
  }
}
