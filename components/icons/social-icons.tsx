import type React from "react"
import { YoutubeIcon as YouTubeIcon, TwitterIcon, TwitchIcon } from "lucide-react"
// Removed: import { DiscordIcon } from "./discord-icon"
// Removed: import { TiktokIcon } from "./tiktok-icon"
// Removed: import { InstagramIcon } from "./instagram-icon"

export function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// Export only the icons that are correctly imported from lucide-react or defined here
export { YouTubeIcon, TwitterIcon, TwitchIcon }
// Removed: DiscordIcon, TiktokIcon, InstagramIcon
