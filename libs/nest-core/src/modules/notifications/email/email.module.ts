import { MailerModule } from '@nestjs-modules/mailer'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { EmailController } from './email.controller'
import { EmailService } from './email.service'

@Module({
	imports: [
		MailerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				transport: {
					// host: configService.getOrThrow('EMAIL_HOST'),
					// auth: {
					// 	user: configService.getOrThrow('EMAIL_USERNAME'),
					// 	pass: configService.getOrThrow('EMAIL_PASSWORD'),
					// },
					host: configService.get('MAIL_HOST'),
					// For SSL and TLS connection
					secure: true,
					port: 465,
					auth: {
						// Account gmail address
						user: configService.get('MAIL_USER'),
						pass: configService.get('MAIL_PASS'),
					},
				},
				// transport: 'smtps://user@domain.com:pass@smtp.domain.com',
				defaults: {
					from: '"Linkerry" <linkerry@linkerry.com>',
				},
			}),
		}),
	],
	providers: [EmailService],
	exports: [EmailService],
	controllers: [EmailController],
})
export class EmailModule {}
