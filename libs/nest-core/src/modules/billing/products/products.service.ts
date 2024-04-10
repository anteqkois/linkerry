import { Id, Product } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProductDocument, ProductModel } from './product.schema'

@Injectable()
export class ProductsService {
	constructor(@InjectModel(ProductModel.name) private readonly flowModel: Model<ProductDocument>) {}

	async create(input: Product) {
		const createdProduct = await  this.flowModel.create(input)
		return createdProduct
		// const newProduct = await this.flowModel.findOne({
		// 	_id: createdProduct.
		// })
	}

	async findMany() {
		return this.flowModel.find()
	}

	async findOne(id: Id) {
		return this.flowModel.findOne({
			_id: id,
		})
	}
}
