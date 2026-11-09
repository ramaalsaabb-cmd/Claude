/** Filter categories (kept separate from the zod schema so client code stays light). */
export const projectCategories = ["vr-mr", "game-dev", "hardware", "3d-modeling", "interactive"] as const;
export type ProjectCategory = (typeof projectCategories)[number];
