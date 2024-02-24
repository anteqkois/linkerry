@UseGuards(LocalAuthGuard) - zwraca model Usera
@UseGuards(JwtCookiesAuthGuard) = zwraca jedynie przetworzony payload JWT
