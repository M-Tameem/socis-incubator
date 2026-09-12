import { cn } from "@/lib/utils";

/** Shared, decorative SOCIS mascot. Inline SVG also renders without JavaScript. */
export function JellyfishMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-30 -30 260 260"
      width="200"
      height="200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M61 107C61 129 39 126 39 145C39 156 49 161 56 155" fill="none" />
        <path d="M83 112C83 134 69 139 73 158C75 168 83 173 90 167" fill="none" />
        <path d="M111 113C111 133 127 140 123 157C121 165 115 171 110 175" fill="none" />
        <path d="M137 106C137 126 159 125 162 141C164 151 157 157 150 153" fill="none" />
        <path d="M43 99C43 62 65 32 100 32C135 32 157 62 157 99C157 110 146 116 137 108C130 119 116 119 108 111C100 121 85 121 77 111C66 119 55 114 53 108C47 108 43 105 43 99Z" fill="#e6b7e7" />
      </g>
      <path d="M56 89C57 63 74 43 100 43C126 43 144 64 144 89C123 81 79 81 56 89Z" fill="#f4d8ef" />
      <path d="M65 65C71 55 80 50 91 48" stroke="#fff8fc" strokeWidth="7" strokeLinecap="round" />
      <ellipse cx="72" cy="95" rx="9" ry="5" fill="#d982b3" />
      <ellipse cx="128" cy="95" rx="9" ry="5" fill="#d982b3" />
      <g fill="#4d2859">
        <ellipse cx="80" cy="84" rx="4.5" ry="6" />
        <ellipse cx="120" cy="84" rx="4.5" ry="6" />
      </g>
      <g fill="#fff8fc">
        <circle cx="81" cy="82" r="1.5" />
        <circle cx="121" cy="82" r="1.5" />
      </g>
      <path d="M93 94Q100 102 107 94" stroke="#4d2859" strokeWidth="3" strokeLinecap="round" />
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M165 41V53M159 47H171M30 91V99M26 95H34M48 14V26M42 20H54M152 162V174M146 168H158M-18 146V154M-22 150H-14" />
      </g>
      <circle cx="36" cy="54" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="172" cy="111" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="110" cy="18" r="2.5" fill="currentColor" opacity="0.5" />
      <circle cx="55" cy="182" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="216" cy="72" r="2.5" fill="currentColor" opacity="0.4" />
      <circle cx="198" cy="188" r="2" fill="currentColor" opacity="0.3" />
    </svg>
  );
}
