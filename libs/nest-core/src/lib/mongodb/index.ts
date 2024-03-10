import mongoose from 'mongoose'

export * from './mongodb.module'
export * from './schemas/timestamp.schema'
export * from './types'

export const generateId = () => new mongoose.Types.ObjectId()
