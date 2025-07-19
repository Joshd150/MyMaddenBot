import type React from "react"

export function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12v-5h3a4 4 0 0 1 4 4v2a2 2 0 0 0 2 2h1v3a8 8 0 0 1-8-8v-2a4 4 0 0 0-4-4H9z" />
      <path d="M12 19h-3a2 2 0 0 1-2-2v-2a2 2 0 0 0-2-2H4v-3a8 8 0 0 0 8 8v2a2 2 0 0 1 2 2h1v3a8 8 0 0 1-8-8v-2a4 4 0 0 0-4-4H9z" />
    </svg>
  )
}
