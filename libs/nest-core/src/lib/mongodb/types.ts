import mongoose from 'mongoose'

export type ObjectId = mongoose.Types.ObjectId
export type IdObjectOrPopulated<L, P extends string, M> = P extends L ? M : M extends Array<any> ? mongoose.Types.ObjectId[] : mongoose.Types.ObjectId
