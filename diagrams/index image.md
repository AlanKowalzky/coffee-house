graph TD
    A[Start] --> B{Aplikacja uruchamia się};
    B --> C{Pobieranie produktów};
    C -- ApiService.getProducts() --> D{Ładowanie z API};
    D -- API nie zwraca 'image' --> E{Ładowanie z products.json (fallback)};
    E -- Wcześniejszy problem: products.json nie ma 'id' --> F{Błędne generowanie ścieżek obrazów przez getImagePath()};
    F --> G{Obrazy nie ładują się / ładują się fallbacki (np. coffee-1.jpg)};
    G --> H{ProductModal próbuje wyświetlić obraz};
    H -- Wcześniejszy problem: 'assets/${product.image}' w ProductModal --> I{Błąd podwójnego 'assets/' lub pusta ścieżka};
    I --> J{Obrazek fallbackowy `assets/coffee-1.jpg` (widoczny w konsoli)};
    J --> K{Wyświetlanie pustego/błędnego obrazu};

    subgraph Poprawki Wprowadzone
        Fixed_id[Dodano 'id' do products.json] --> L{ApiService.getFallbackProductImagesMap() bezpośrednio używa 'image' z products.json};
        Fixed_path[ProductModal.ts używa bezpośrednio product.image] --> M{ProductModal wyświetla obraz};
        Fixed_id --> M;
        Fixed_path --> M;
    end

    C -- API zwraca 'image' lub L --> N{Produkt z poprawną ścieżką obrazu};
    N --> M;
    M --> O[Obrazy ładują się poprawnie];

    subgraph Poprzednie Rozwiązane Problemy (nie związane z obrazami)
        MissingScript[Brak tagu &lt;script&gt; w HTML] --> ScriptAdded[Dodano tag &lt;script&gt; w HTML];
        WebpackPublicPath[Problemy ze ścieżką publicPath Webpacka] --> PublicPathFixed[Dodano publicPath w webpack.config.js];
    end

    O --> P[Koniec];
