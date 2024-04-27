import { z } from 'zod';

export const stringShortSchema = z.string().max(255)
// export const stringDateSchema = z
//   .string()
//   .datetime({ offset: true })
//   .pipe(z.coerce.date());
export const stringDateSchema = z.string().datetime({ offset: true });
export const connectorNameSchema = z.string().regex(/^@linkerry\/.*/);
export const versionSchema = z.string().regex(/^([~^])?[0-9]+\.[0-9]+\.[0-9]+$/);
export const stepNameSchema =  z.string().regex(/^([a-zA-Z]+)_(\d+)$/);
export const idSchema = z.string().regex(/^[0-9a-f]{24}$/)
