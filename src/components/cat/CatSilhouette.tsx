/** Small decorative cat silhouettes used as quiet accents around the site. */

type Props = { className?: string; variant?: "sitting" | "peek" };

export default function CatSilhouette({ className = "", variant = "sitting" }: Props) {
  if (variant === "peek") {
    return (
      <svg viewBox="0 0 120 60" className={className} aria-hidden="true" focusable="false">
        <path d="M22 60 C 22 34, 30 20, 34 6 L 50 22 C 56 20, 64 20, 70 22 L 86 6 C 90 20, 98 34, 98 60 Z" fill="currentColor" />
        <g className="cat-peek-eyes" fill="#e3b862">
          <ellipse cx="47" cy="38" rx="5" ry="4.5" />
          <ellipse cx="73" cy="38" rx="5" ry="4.5" />
        </g>
        <ellipse cx="47" cy="38" rx="1.6" ry="3.6" fill="#120f0f" />
        <ellipse cx="73" cy="38" rx="1.6" ry="3.6" fill="#120f0f" />
        <ellipse cx="34" cy="58" rx="9" ry="4" fill="currentColor" />
        <ellipse cx="86" cy="58" rx="9" ry="4" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 80" className={className} aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M20 22 L 18 4 L 28 14 C 30 13.5, 34 13.5, 36 14 L 46 4 L 44 22 C 47 26, 47 32, 43 36 C 50 44, 52 56, 50 70 C 56 70, 62 66, 62 58 C 62 54, 58 52, 58 48 C 58 46, 61 46, 62 48 C 66 54, 66 74, 50 76 L 18 76 C 12 76, 12 70, 16 66 C 14 56, 14 44, 21 36 C 17 32, 17 26, 20 22 Z"
      />
    </svg>
  );
}
