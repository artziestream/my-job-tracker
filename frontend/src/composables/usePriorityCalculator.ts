export function usePriorityCalculator() {
    const calculatePriority = (data: {
        postedDate?: string;
        postingEndDate?: string;
        preference: string;
        hasContacts: boolean;
    }): string => {
        let score = 0;

        if (data.preference === 'STRONGLY_PREFER') score += 3;
        else if (data.preference === 'PREFER') score += 2;
        else if (data.preference === 'NEUTRAL') score += 1;
        else if (data.preference === 'AVOID') score -= 1;
        else if (data.preference === 'DEALBREAKER') score -= 3;

        if (data.hasContacts) {
            score += 2;
        }

        if (data.postingEndDate) {
            const endDate = new Date(data.postingEndDate);
            const now = new Date();
            const daysUntilEnd = Math.floor(
                (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysUntilEnd <= 3) score += 2;
            else if (daysUntilEnd <= 7) score += 1;
        }

        if (data.postedDate) {
            const posted = new Date(data.postedDate);
            const now = new Date();
            const daysSincePosted = Math.floor(
                (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysSincePosted <= 2) score += 1;
        }

        if (score >= 5) return 'HIGH';
        if (score >= 2) return 'MEDIUM';
        return 'LOW';
    };

    return { calculatePriority };
}