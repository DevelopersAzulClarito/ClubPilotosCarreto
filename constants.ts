/**
 * La cantidad base de XP (Puntos).
 */
export const XP_PER_LEVEL = 1000;


export const getRequiredXpForLevel = (currentLevel: number): number => {
    return XP_PER_LEVEL * currentLevel;
};