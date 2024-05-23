import { Controller } from '@nestjs/common'
import { UserSettingsService } from './user-settings.service'

@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}
}
