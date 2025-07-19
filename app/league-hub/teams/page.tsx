import { getLatestTeams, getLatestPlayers } from "@/lib/madden-firestore-db"
import { convertToSerializable } from "@/lib/utils"
import type { Player, Team } from "@/lib/madden-types"
import { TeamPlayersDialog } from "@/components/league-hub/team-players-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TeamLogo } from "@/components/league-hub/team-logo"

export const revalidate = 0 // Ensure dynamic rendering

export default async function TeamsPage() {
  const leagueId = process.env.NEXT_PUBLIC_LEAGUE_ID
  if (!leagueId) {
    return <div className="p-4 text-red-500">League ID is not configured.</div>
  }

  let teams: Team[] = []
  let players: Player[] = []
  let error: string | null = null

  try {
    const [rawTeams, rawPlayers] = await Promise.all([
      getLatestTeams(leagueId),
      getLatestPlayers(leagueId),
    ])
    teams = convertToSerializable(rawTeams)
    players = convertToSerializable(rawPlayers)
  } catch (err: any) {
    console.error("Failed to load teams or players:", err)
    error = `Failed to load data: ${err.message}`
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  // Build map of players by team
  const playersByTeam = new Map<number, Player[]>()
  players.forEach((player) => {
    if (!playersByTeam.has(player.teamId)) {
      playersByTeam.set(player.teamId, [])
    }
    playersByTeam.get(player.teamId)!.push(player)
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teams.map((team) => (
          <TeamPlayersDialog
            key={team.teamId}
            team={team}
            players={playersByTeam.get(team.teamId) || []}
          >
            <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{team.displayName}</CardTitle>
                <TeamLogo teamAbbr={team.abbrName} className="h-8 w-8" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-2xl font-bold">{team.ovrRating} OVR</div>
                <p className="text-xs text-muted-foreground">{team.divName}</p>
              </CardContent>
            </Card>
          </TeamPlayersDialog>
        ))}
      </div>
    </div>
  )
}
