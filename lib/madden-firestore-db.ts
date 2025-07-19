import { db } from "./firebase-admin" // Import the shared db instance
import {
  type Player,
  type Team,
  type Standing,
  type PlayerStatEntry,
  PlayerStatType,
  type MaddenGame,
  type LeagueSettings,
} from "./madden-types"

// Helper function to fetch a collection
async function fetchCollection<T>(collectionPath: string): Promise<T[]> {
  try {
    const snapshot = await db.collection(collectionPath).get()
    return snapshot.docs.map((doc) => doc.data() as T)
  } catch (error) {
    console.error(`Error fetching collection ${collectionPath}:`, error)
    throw new Error(`Failed to fetch ${collectionPath}.`)
  }
}

// Helper function to fetch a document
async function fetchDocument<T>(docPath: string): Promise<T | undefined> {
  try {
    const doc = await db.doc(docPath).get()
    return doc.exists ? (doc.data() as T) : undefined
  } catch (error) {
    console.error(`Error fetching document ${docPath}:`, error)
    throw new Error(`Failed to fetch ${docPath}.`)
  }
}

// Madden League Data Fetchers
const MaddenDBImpl = {
  async getLatestPlayers(leagueId: string): Promise<Player[]> {
    // Matches bot: league_data/{leagueId}/MADDEN_PLAYER
    const playerSnapshot = await db.collection(`league_data/${leagueId}/MADDEN_PLAYER`).get()
    return playerSnapshot.docs.filter((d) => !d.id.startsWith("roster")).map((doc) => doc.data() as Player)
  },

  async getLatestTeams(leagueId: string): Promise<Team[]> {
    // Matches bot: league_data/{leagueId}/MADDEN_TEAM
    const teamDocs = await db.collection(`league_data/${leagueId}/MADDEN_TEAM`).get()
    return teamDocs.docs.filter((d) => d.id !== "leagueteams").map((d) => d.data() as Team)
  },

  async getLatestStandings(leagueId: string): Promise<Standing[]> {
    // Matches bot: league_data/{leagueId}/MADDEN_STANDING
    const standingSnapshot = await db.collection(`league_data/${leagueId}/MADDEN_STANDING`).get()
    return standingSnapshot.docs.filter((d) => d.id !== "standings").map((doc) => doc.data() as Standing)
  },

  async getPlayerStats(leagueId: string, rosterId: number): Promise<PlayerStatEntry[]> {
    // The bot's getStats function queries league_data/{leagueId}/{collection}
    // This function is not directly used by the web app's stats page for aggregation,
    // but it's here for consistency if individual player stats are needed.
    // The web app's stats page fetches stats by type (e.g., getPassingStats)
    // and then aggregates them.
    // This path is not explicitly shown in the bot's `getStats` but inferred from its usage.
    // If the bot stores individual player stats under a specific path, this needs to match.
    // For now, we'll rely on the `getStatsCollection` for type-specific stats.
    console.warn(
      "getPlayerStats is not directly mapped to bot's structure for individual player stats. Relying on getStatsCollection.",
    )
    return [] // Or implement based on how bot stores individual player stats if different from type-specific
  },

  async getStatsCollection(
    leagueId: string,
    statType: PlayerStatType,
    seasonIndex?: number,
    weekIndex?: number,
  ): Promise<PlayerStatEntry[]> {
    // Matches bot: league_data/{leagueId}/{statType} (e.g., MADDEN_PASSING_STAT)
    let query = db.collection(`league_data/${leagueId}/${statType}`).where("stageIndex", ">", 0)

    if (seasonIndex !== undefined) {
      query = query.where("seasonIndex", "==", seasonIndex) as any // Firebase query chaining
    }
    if (weekIndex !== undefined) {
      query = query.where("weekIndex", "==", weekIndex) as any // Firebase query chaining
    }

    const snapshot = await query.get()
    return snapshot.docs.map((doc) => doc.data() as PlayerStatEntry)
  },

  async getPassingStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.PASSING, seasonIndex, weekIndex)
  },

  async getRushingStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.RUSHING, seasonIndex, weekIndex)
  },

  async getReceivingStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.RECEIVING, seasonIndex, weekIndex)
  },

  async getDefensiveStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.DEFENSE, seasonIndex, weekIndex)
  },

  async getKickingStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.KICKING, seasonIndex, weekIndex)
  },

  async getPuntingStats(leagueId: string, seasonIndex?: number, weekIndex?: number): Promise<PlayerStatEntry[]> {
    return this.getStatsCollection(leagueId, PlayerStatType.PUNTING, seasonIndex, weekIndex)
  },

  async getWeekScheduleForSeason(leagueId: string, weekIndex: number, seasonIndex: number): Promise<MaddenGame[]> {
    // Matches bot: league_data/{leagueId}/MADDEN_SCHEDULE
    const weekDocs = await db
      .collection(`league_data/${leagueId}/MADDEN_SCHEDULE`)
      .where("weekIndex", "==", weekIndex - 1) // Bot uses 0-indexed weeks for schedule
      .where("seasonIndex", "==", seasonIndex)
      .where("stageIndex", "==", 1) // Assuming stageIndex 1 means regular season/playoff games
      .get()
    return weekDocs.docs.filter((d) => !d.id.startsWith("schedules")).map((d) => d.data() as MaddenGame)
  },

  async getAllSchedules(leagueId: string): Promise<MaddenGame[]> {
    // This is a simplified version compared to the bot's history reconstruction.
    // It fetches all games from the MADDEN_SCHEDULE collection.
    const allDocs = await db.collection(`league_data/${leagueId}/MADDEN_SCHEDULE`).get()
    return allDocs.docs.filter((d) => !d.id.startsWith("schedules")).map((d) => d.data() as MaddenGame)
  },

  async getTeamStats(leagueId: string): Promise<any[]> {
    // Assuming team stats are stored in a collection like 'team_stats'
    // The bot code doesn't explicitly show a 'team_stats' collection.
    // If this is a separate collection, ensure its path is correct.
    // For now, keeping the original path, but be aware it might need adjustment.
    return fetchCollection<any>(`madden_leagues/${leagueId}/team_stats`)
  },

  async fetchLeagueSettings(guildId: string): Promise<LeagueSettings | undefined> {
    // Matches bot: league_settings/{guildId}
    return fetchDocument<LeagueSettings>(`league_settings/${guildId}`)
  },
}

export const getLatestStandings = MaddenDBImpl.getLatestStandings;
export const getPlayerStats = MaddenDBImpl.getPlayerStats;
export const getStatsCollection = MaddenDBImpl.getStatsCollection;
export const getLatestTeams = MaddenDBImpl.getLatestTeams;
export const getLatestPlayers = MaddenDBImpl.getLatestPlayers;
export default MaddenDBImpl;