import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { render } from '@react-email/render'

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ subject, to, reactEmailComponent, props, text }: SendEmailProps) {
    const emailHtml = reactEmailComponent ? render(reactEmailComponent(props ?? {})) : undefined

    await this.mailerService.sendMail({
      to,
      // from: '"Welcome to the Linkerry" <linkerry@gmail.com>',
      subject,
      text,
      html: emailHtml,
    })
  }
}

export interface SendEmailProps {
  to: string
  subject: string
  text?: string
  // TODO fix type for react to support prop types
  // reactEmailComponent?: ReactElement
  reactEmailComponent?: any
  props?: object
}
