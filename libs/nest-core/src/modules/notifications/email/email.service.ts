import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
	constructor(private readonly mailerService: MailerService) {}

	async sendEmail({ subject, to, html, text }: SendEmialProps) {
		await this.mailerService.sendMail({
			to,
			from: '"Welcome to the Linkerry" <linkerry@gmail.com>',
			subject,
			text,
			html,
		})
	}
}

export interface SendEmialProps {
	to: string
	subject: string
	text?: string
	html?: string
}
