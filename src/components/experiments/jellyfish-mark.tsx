import { cn } from "@/lib/utils";

/**
 * Optional local brand sketch. Remove this file and its one import if the
 * jellyfish direction does not survive review.
 */
export function JellyfishMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none", className)}
      aria-hidden="true"
    >
      <path
        d="M36 87C36 54 59 31 90 31C121 31 144 54 144 87H36Z"
        fill="currentColor"
        fillOpacity="0.12"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M53 88C53 107 43 111 43 129C43 139 48 146 56 150" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M78 88C78 112 66 117 66 136C66 144 70 150 76 153" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M102 88C102 112 114 117 114 136C114 144 110 150 104 153" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M127 88C127 107 137 111 137 129C137 139 132 146 124 150" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="72" cy="68" r="3" fill="currentColor" />
      <circle cx="108" cy="68" r="3" fill="currentColor" />
    </svg>
  );
}
