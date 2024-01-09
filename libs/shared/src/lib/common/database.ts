import { z } from "zod";

export type Id = string // Id to db docuemnt

export const idStringSchema = z.string().regex(/^[0-9a-f]{24}$/);

export interface DbTimestamp {
  createdAt?: Date
  updatedAt?: Date
}
