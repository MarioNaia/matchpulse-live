import { MatchFeatures } from "./types";

type ApiTeam = {
  id?: string;
  name?: string;
  position?: string | null;
  score?: {
    f?: string | null;
    "1h"?: string | null;
    "2h"?: string | null;
    o?: string | null;
    p?: string | null;
  };
  perf?: {
    l_5_matches?: string | null;
    avg_game_goals?: string | null;
    avg_goals_scored?: string | null;
    avg_goals_conceded?: string | null;
    btts?: string | null;
    tot_goals_scored?: string | null;
    tot_goals_conceded?: string | null;
    [key: string]: unknown;
  };
  stats?: {
    possession?: string | null;
    attacks?: {
      n?: string | null;
      n_15?: string | null;
      n_5?: string | null;
      d?: string | null;
      d_15?: string | null;
      d_5?: string | null;
      o_s?: string | null;
    };
    shoots?: {
      t?: string | null;
      off?: string | null;
      off_15?: string | null;
      off_5?: string | null;
      on?: string | null;
      on_15?: string | null;
      on_5?: string | null;
      g_a?: string | null;
    };
    penalties?: string | null;
    corners?: {
      t?: string | null;
      f?: string | null;
      h?: string | null;
      c_15?: string | null;
      c_5?: string | null;
    };
    fouls?: {
      t?: string | null;
      y_c?: string | null;
      y_t_r_c?: string | null;
      r_c?: string | null;
    };
    substitutions?: string | null;
    throwins?: string | null;
    injuries?: string | null;
    dominance_avg_2_5?: string | null;
  };
};

export type ApiMatch = {
  id: string;
  date?: string;
  timer?: string;
  est_e_time?: boolean;
  in_play?: boolean;
  championship?: {
    id?: string;
    name?: string;
    s_name?: string;
    country?: string;
  };
  teamA: ApiTeam;
  teamB: ApiTeam;
  dominance_index?: Array<{
    timer?: string;
    teamA?: string | number;
    teamB?: string | number;
  }>;
};

function n(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseMinute(timer?: string) {
  if (!timer) return 0;
  const firstPart = timer.split(":")[0];
  const minute = Number(firstPart);
  if (!Number.isFinite(minute)) return 0;
  return Math.min(90, Math.max(0, Math.floor(minute)));
}

export function buildFeatures(match: ApiMatch): MatchFeatures {
  const homeGoals = n(match.teamA.score?.f);
  const awayGoals = n(match.teamB.score?.f);

  return {
    minute: parseMinute(match.timer),
    homeGoals,
    awayGoals,
    scoreDiff: homeGoals - awayGoals,
    shotsDiff: n(match.teamA.stats?.shoots?.t) - n(match.teamB.stats?.shoots?.t),
    shotsOnTargetDiff:
      n(match.teamA.stats?.shoots?.on) - n(match.teamB.stats?.shoots?.on),
    possessionDiff:
      n(match.teamA.stats?.possession) - n(match.teamB.stats?.possession),
    redCardDiff:
      n(match.teamA.stats?.fouls?.r_c) - n(match.teamB.stats?.fouls?.r_c),
    dangerousAttacksDiff:
      n(match.teamA.stats?.attacks?.d) - n(match.teamB.stats?.attacks?.d),
    dangerousAttacksLast5Diff:
      n(match.teamA.stats?.attacks?.d_5) -
      n(match.teamB.stats?.attacks?.d_5),
    cornersDiff:
      n(match.teamA.stats?.corners?.t) - n(match.teamB.stats?.corners?.t),
    cornersLast5Diff:
      n(match.teamA.stats?.corners?.c_5) -
      n(match.teamB.stats?.corners?.c_5),
  };
}