# Problem: Podwójne/ wielokrotne dodawanie do koszyka — analiza i poprawki
```mermaid
flowchart TD
  A[Użytkownik otwiera modal produktu] --> B[Render opcji + rejestracja handlerów]
  B --> C{Czy event handler jest rejestrowany wielokrotnie?}
  C -- Tak --> D[Każde otwarcie modala dokłada listenery]
  D --> E[Kliknięcie Add to Cart uruchamia handlery N razy]
  E --> F[Do koszyka trafia N elementów]
  C -- Nie --> G[Standardowe zachowanie: 1 dodanie]

  subgraph Fixes [Wprowadzone poprawki]
    F1[Zamiana addEventListener -> onclick - nadpisanie handlera]
    F2[Guard isAdding + disable button - debounce]
    F3[Globalne flagi init: __coffeeHouseAppInitialized / __menuAppInitialized]
  end

  D --> F1
  D --> F2
  D --> F3
  F1 --> H[Handlery nie nakładają się]
  F2 --> H
  F3 --> H
  H --> I[Kliknięcie Add to Cart -> 1 wywołanie -> 1 element w koszyku]

  classDef problem fill:#ffe6e6,stroke:#ff6666;
  classDef fix fill:#e6ffea,stroke:#33aa33;
  class A,B,C,D,E,F problem;
  class F1,F2,F3 fix;

  %% Dodatkowe notatki
  N1[Uwaga: jeśli nadal występuje problem, użyć console.trace w Cart.addItem aby zobaczyć stack trace wywołań]:::problem
  I --> N1
```

Plik zawiera krótkie objaśnienie i diagram pokazujący źródło błędu oraz zastosowane poprawki: nadpisanie onclick zamiast doklejania listenerów, defensywny guard + wyłączenie przycisku, i globalne flagi inicjalizacji aplikacji.