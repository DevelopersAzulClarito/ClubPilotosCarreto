/**
 * La cantidad base de Puntos por nivel.
 */
export const POINTS_PER_LEVEL = 50;

/**
 * Calcula los puntos necesarios para avanzar al siguiente nivel.
 * Va de 50 en 50.
 * Nivel 0 requiere 50 Puntos para pasar al Nivel 1
 * Nivel 1 requiere 100 Puntos para pasar al Nivel 2
 * Nivel 2 requiere 150 Puntos para pasar al Nivel 3...
 */
export const getRequiredXpForLevel = (currentLevel: number): number => {
    return POINTS_PER_LEVEL * (currentLevel + 1);
};