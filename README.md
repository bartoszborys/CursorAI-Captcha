# CAPTCHA System

System CAPTCHA składający się z backendu w NestJS i frontendu w React (w trakcie implementacji).

## Struktura projektu

- `captcha-backend/` - Backend w NestJS
- `captcha-frontend/` - Frontend w React (w trakcie implementacji)

## Uruchomienie z Docker

1. Upewnij się, że masz zainstalowany Docker i Docker Compose
2. W głównym katalogu projektu wykonaj:

```bash
docker-compose up --build
```

Aplikacja będzie dostępna pod adresem `http://localhost:3000`

## Dokumentacja API

Po uruchomieniu aplikacji, dokumentacja Swagger jest dostępna pod adresem:
`http://localhost:3000/api`

## Funkcje

- Generowanie matematycznych CAPTCHA
- Weryfikacja rozwiązań
- Ochrona przed brute force (maksymalnie 3 próby)
- Automatyczne wygasanie CAPTCHA po 2 minutach
- Integracja z Redis do przechowywania danych
- Dokumentacja API w Swagger

## Rozwój

### Backend

Szczegółowe instrukcje dotyczące backendu znajdują się w katalogu `captcha-backend/README.md`

### Frontend

Szczegółowe instrukcje dotyczące frontendu będą dostępne w katalogu `captcha-frontend/README.md`
