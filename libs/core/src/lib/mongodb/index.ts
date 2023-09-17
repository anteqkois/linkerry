import mongoose from 'mongoose'

export * from './mongodb.module'

export const generateId = () => new mongoose.Types.ObjectId()
