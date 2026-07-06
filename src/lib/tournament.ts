// Path: src/lib/tournament.ts

export interface MatchStatsResult {
    homeTotal: number;
    awayTotal: number;
    isCompleted: boolean;
    isWin: boolean;
    isDraw: boolean;
    isLoss: boolean;
}

/**
 * Fungsi tunggal terpusat untuk menghitung skor agregat dan status hasil laga
 * sirkuit BELOVEsPORT berdasarkan perspektif Tim Koko (apakah sebagai Home atau Away)
 */
export function calculateMatchResult(match: any, teamIds: string[]): MatchStatsResult {
    const isCompleted = match.matchStatus === 'COMPLETED';
    
    // Hitung total skor agregat masing-masing tim (Leg 1 + Leg 2)
    const homeTotal = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
    const awayTotal = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);
    
    const isHome = teamIds.includes(match.homeTeamId || '');
    
    // Tentukan skor tim kita vs skor musuh
    const myScore = isHome ? homeTotal : awayTotal;
    const enemyScore = isHome ? awayTotal : homeTotal;

    return {
        homeTotal,
        awayTotal,
        isCompleted,
        isWin: isCompleted && myScore > enemyScore,
        isDraw: isCompleted && myScore === enemyScore,
        isLoss: isCompleted && myScore < enemyScore
    };
}