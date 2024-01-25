import { Injectable } from '@nestjs/common';
import { hash, genSalt, compare } from 'bcrypt'

@Injectable()
export class HashService {
  async hash(password: string) {
    const salt = await genSalt()
    return await hash(password, salt);
  }

  async compare(password: string, hash: string) {
    return await compare(password, hash);
  }
}
