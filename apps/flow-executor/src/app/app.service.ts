import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {

  getMetadata(name: string) {
    return 'metdata meh' + name
  }
}
