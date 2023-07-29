enum Country {
  'pl' = 'Poland',
}

type CountryLiteral = Record<
  Country,
  {
    ISO: string
  }
>
const CountryLiteral: CountryLiteral = {
  Poland: { ISO: 'PL' },
}
