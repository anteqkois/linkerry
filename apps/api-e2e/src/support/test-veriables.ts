import { CreateCustomerDto, LanguageType } from '@market-connector/core'

export const testUser: CreateCustomerDto = {
  consents: {
    test1: true,
    test2: true,
  },
  email: 'anteq@gmail.com',
  language: LanguageType.pl,
  name: 'anteq',
  password: 'antekkoisA',
}
