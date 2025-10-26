# Product Modal — Esc & Tooltip

Diagram przedstawia przepływ zdarzeń w modalnym widoku produktu: otwarcie, renderowanie opcji, obsługa hover (tooltip pokazujący cenę z `data-price`) oraz zamykanie przyciskiem/overlay/klawiszem Esc.

```mermaid
flowchart TD
  A[Otwórz modal produktu] --> B[Renderuj zawartość i opcje]
  B --> C[Zarejestruj listener klawisza Esc]
  B --> D[Podłącz handlery hover do przycisków opcji]
  D --> E[mouseenter na przycisku opcji]
  E --> F[Wyświetl tooltip z wartością z data-price]
  F --> G[Ustaw pozycję nad przyciskiem, wyśrodkowany]
  D --> H[mouseleave na przycisku opcji]
  H --> I[Ukryj tooltip]
  C --> J[Esc naciśnięty lub klik overlay/close]
  J --> K[Zamknij modal i usuń listener Esc]
  K --> L[Usuń tooltip (jeśli istnieje) i przywróć overflow body]

  classDef notes fill:#f9f,stroke:#333,stroke-width:1px,color:#111;
  subgraph Notes [Dodatkowe założenia]
    N1[Tooltip pobiera cenę z atrybutu data-price]:::notes
    N2[Waluta: zł (można skonfigurować)]:::notes
  end
```
