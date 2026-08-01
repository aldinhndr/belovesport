// Path: src/lib/tournament.ts

export interface MatchStatsResult {
    homeTotal: number;
    awayTotal: number;
    isCompleted: boolean;
    isWin: boolean;
    isDraw: boolean;
    isLoss: boolean;
    winnerId: string | null;
}

/**
 * Fungsi terpusat untuk menghitung agregat skor Leg 1 + Leg 2
 * serta mengevaluasi pemenang pertandingan.
 */
export function calculateMatchResult(match: any, teamIds: string[]): MatchStatsResult {
    const isCompleted = match.matchStatus === 'COMPLETED';
    
    // Hitung total skor agregat masing-masing tim (Leg 1 + Leg 2)
    const homeTotal = (match.homeScoreLeg1 ?? 0) + (match.homeScoreLeg2 ?? 0);
    const awayTotal = (match.awayScoreLeg1 ?? 0) + (match.awayScoreLeg2 ?? 0);
    
    const isHome = teamIds.includes(match.homeTeamId || '');
    
    const myScore = isHome ? homeTotal : awayTotal;
    const enemyScore = isHome ? awayTotal : homeTotal;

    let winnerId: string | null = null;
    if (isCompleted) {
        if (homeTotal > awayTotal) {
            winnerId = match.homeTeamId;
        } else if (awayTotal > homeTotal) {
            winnerId = match.awayTeamId;
        }
    }

    return {
        homeTotal,
        awayTotal,
        isCompleted,
        isWin: isCompleted && myScore > enemyScore,
        isDraw: isCompleted && myScore === enemyScore,
        isLoss: isCompleted && myScore < enemyScore,
        winnerId
    };
}