import { Card, CardContent } from "@/components/ui/card"
import type { Game } from "@/lib/madden-types"
import { TeamLogo } from "./team-logo"
import { GameDetailDialog } from "./game-detail-dialog"

interface GameCardProps {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  const gameDate = new Date(game.gameDate)
  const formattedDate = gameDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
  const formattedTime = gameDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4 flex flex-col items-center gap-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">Week {game.week}</div>
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-2">
            <TeamLogo teamName={game.awayTeamName} className="h-12 w-12" />
            <span className="font-medium text-lg">{game.awayTeamName}</span>
            {game.awayScore !== undefined && <span className="text-2xl font-bold">{game.awayScore}</span>}
          </div>
          <div className="text-2xl font-bold mx-4">-</div>
          <div className="flex flex-col items-center gap-2">
            <TeamLogo teamName={game.homeTeamName} className="h-12 w-12" />
            <span className="font-medium text-lg">{game.homeTeamName}</span>
            {game.homeScore !== undefined && <span className="text-2xl font-bold">{game.homeScore}</span>}
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate} at {formattedTime}
        </div>
        <GameDetailDialog game={game} />
      </CardContent>
    </Card>
  )
}
