import { Module } from '@nestjs/common';
import { AlertLinkService } from './alert-link.service';
import { AlertLinkController } from './alert-link.controller';

@Module({
  controllers: [AlertLinkController],
  providers: [AlertLinkService]
})
export class AlertLinkModule {}
