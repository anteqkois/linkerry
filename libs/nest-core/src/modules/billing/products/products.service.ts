import { FindManyProductsQuery, Id, Product, ProductWithPrices } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { PriceDocument, PriceModel } from './prices/price.schema'
import { ProductDocument, ProductModel } from './product.schema'

@Injectable()
export class ProductsService {
	constructor(
		@InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>,
		@InjectModel(PriceModel.name) private readonly priceModel: Model<PriceDocument>,
	) {}

	async create(input: Product) {
		const createdProduct = await this.productModel.create(input)
		return createdProduct
	}

	async findMany(query: FindManyProductsQuery) {
		const filter: FilterQuery<Product> = {}
		if (query.type) filter.type = query.type

		const products = await this.productModel.find(filter)
		const items: ProductWithPrices[] = []
		for (const product of products) {
			const prices = await this.priceModel.find({
				productId: product.id,
			})
			items.push({
				...product.toObject(),
				prices: prices
			})
		}

		return items
	}

	async findOne(id: Id) {
		return this.productModel.findOne({
			_id: id,
		})
	}
}
