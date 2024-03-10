import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Observable } from 'rxjs'
import { FlowDocument, FlowModel } from '../../flows/schemas/flow.schema'

/* UNUSED */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(@InjectModel(FlowModel.name) private readonly flowsModel: Model<FlowDocument>) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()

		return true
	}
}
