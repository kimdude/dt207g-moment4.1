# DT207G - Moment 4.1
## Autentisering och säkerhet

Repot innehåller källkod för ett express-baserat API, som hanterar registrering och inloggning av användarkonton. Det använder JSON Web Token (JWT) för auktorisering av användare och ger på så vis tillgång till användarens egna uppgifter. API:et är kopplat till en MongoDB databas och använder Bcrypt för att hasha lösenord.

### Datan

Datan som lagras är:
* username _(obligatorisk och unik)_
* password _(obligatorisk)_
* email _(obligatorisk)_
* firstname
* surname
* created _(Genereras automatisk)_

### Länk

Grundlänken till API:et är [] **Fyll på här**

Följande router kan användas för att använda API:et:
| Metod     | Länk           | Resultat                                 |
|-----------|----------------|------------------------------------------|
| POST      | /register      | Registrerar användare                    |
| POST      | /login         | Loggar in användare                      |
| GET       | /protected     | Returnerar användarens kontouppgifter    |

### Svar
Vid inloggning returneras användaruppgifter, förutom lösenord, i JSON-format med följande struktur:

```json
  {
    "username": "testing",
    "email": "tjolahop@snällafunka.se",
    "firstname": "Test",
    "surname": "Testsson",
    "created": "2025-05-10T09:21:29.060Z"
  }
```

_Kim Dudenhöfer_
_2025-05-10_