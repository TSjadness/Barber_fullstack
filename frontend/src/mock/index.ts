import seed from "./db.json";
import type { MockDatabase } from "./types";
/** Deep copy: mutations in UI must never change the bundled seed. */
export const createMockDatabase = (): MockDatabase => structuredClone(seed) as MockDatabase;
