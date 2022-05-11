/** @description Representation of a single permission override as it appears on models and in the database */
export type OverrideField = {
  /**
   * Format: int64
   * @description Allow bit flags
   */
  a: number;

  /**
   * Format: int64
   * @description Disallow bit flags
   */
  d: number;
}