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
          host: configService.getOrThrow('SENDGRID_SMTP_HOST'),
          // For SSL and TLS connection
          secure: true,
          port: configService.getOrThrow('SENDGRID_SMTP_PORT'),
          // secure: false,
          // port: 587,
          auth: {
            // Account gmail address
            user: configService.getOrThrow('SENDGRID_SMTP_USER'),
            pass: configService.getOrThrow('SENDGRID_API_KEY'),
          },
        },
        // transport: 'smtps://user@domain.com:pass@smtp.domain.com',
        defaults: {
          from: '"Linkerry" <noreply@linkerry.com>',
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
