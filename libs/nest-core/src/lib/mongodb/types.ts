import mongoose from 'mongoose'

export type ObjectId = mongoose.Types.ObjectId
export type IdObjectOrPopulated<LiteralStrings, Key extends string, Model> = Key extends LiteralStrings ? Model : Model extends Array<any> ? mongoose.Types.ObjectId[] : mongoose.Types.ObjectId
