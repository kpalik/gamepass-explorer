# GamePass Explorer

Aplikacja one-page do porównywania planów GamePass i wyszukiwania gier.

## Funkcje

- **🔍 Wyszukiwanie gier** - Szybkie wyszukiwanie gier i sprawdzanie w jakich planach są dostępne
- **📊 Porównanie planów** - Przegląd wszystkich gier dostępnych w każdym planie (Essentials, Premium, Ultimate)
- **⚠️ Analiza utraty dostępu** - Sprawdzenie jakie gry stracisz przy przejściu na niższy plan

## Uruchomienie

1. Otwórz plik `index.html` w przeglądarce
2. Aplikacja automatycznie załaduje dane z pliku `games.json`

## Struktura plików

```
gamepassexplorer/
├── index.html      # Główny plik aplikacji
├── app.js          # Logika JavaScript
├── games.json      # Baza danych gier
└── README.md       # Ten plik
```

## Format pliku games.json

```json
[
  {
    "id": 1,
    "title": "Nazwa gry",
    "plans": ["essentials", "premium", "ultimate"],
    "url": "https://www.microsoft.com/pl-pl/p/nazwa-gry/ID"
  }
]
```

### Dostępne plany:
- `essentials` - Plan podstawowy
- `premium` - Plan średni
- `ultimate` - Plan premium

## Aktualizacja danych

Aby zaktualizować listę gier, edytuj plik `games.json` zachowując powyższy format. Każda gra musi mieć:
- `id` - unikalny identyfikator (liczba)
- `title` - nazwa gry (string)
- `plans` - tablica planów, w których gra jest dostępna
- `url` - (opcjonalnie) link do sklepu Microsoft Store

## Technologie

- HTML5
- TailwindCSS (via CDN)
- Vanilla JavaScript
- JSON dla przechowywania danych
