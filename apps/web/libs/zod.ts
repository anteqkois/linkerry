import { z } from "zod";

export const mongoIdSchema = z.string().regex(/^[0-9a-f]{24}$/);
