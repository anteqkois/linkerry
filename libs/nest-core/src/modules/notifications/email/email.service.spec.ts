import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { EmailModule } from './email.module'
import { EmailService } from './email.service'

describe('EmailService', () => {
	let service: EmailService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
				}),
				EmailModule
			],
			providers: [EmailService],
		}).compile()

		service = module.get<EmailService>(EmailService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should send test email', async () => {
		await service.sendTestEmail()
	})
})
