import { CreateUserDto, LanguageType } from '@market-connector/core'

export const testUser: CreateUserDto = {
  consents: {
    test1: true,
    test2: true,
  },
  email: 'anteq@gmail.com',
  language: LanguageType.pl,
  name: 'anteq',
  password: 'antekkoisA',
}

export const authUser: CreateUserDto = {
  consents: {
    test1: true,
    test2: true,
  },
  email: 'anteqkois@gmail.com',
  language: LanguageType.pl,
  name: 'anteqkois',
  password: 'antekkoisA',
}
