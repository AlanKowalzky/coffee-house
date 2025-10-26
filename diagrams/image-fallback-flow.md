graph TD
    A[Wywołanie App.init()] --> B{DOMContentLoaded załadowany?};
    B -- Tak --> C[App.initializeComponents()];
    C --> D[app.apiService.getProducts()/getFavoriteProducts()];
    D --> E{Pobieranie produktów z API};
    E -- Sukces --> F[Pobranie fallbackImageMap z products.json i wszystkich mockowanych produktów];

    F --> G[Utwórz Mapę produktów (productsMap)];

    G --> H{Dla każdego produktu z API};
    H --> I[Przetwórz produkt z API (normalizacja kategorii, logowanie, etc.)];
    I --> J{Określ imagePath z API (użyteczny obrazek vs. null)};
    J --> K{Jeśli imagePath z API nieużyteczny LUB 'default.jpg'};
    K -- Tak --> L[Spróbuj pobrać obrazek z fallbackImageMap];
    L --> M[Jeśli brak w fallbacku, ustaw 'default.jpg'];
    K -- Nie --> N[Użyj imagePath z API];
    M --> O[Dodaj produkt do productsMap (API ma priorytet)];
    N --> O;
    H -- Koniec produktów API --> P{Dla każdego mockowanego produktu};
    P --> Q{Jeśli produkt nie istnieje już w productsMap (API ma priorytet)};
    Q -- Tak --> R[Przetwórz mockowany produkt (normalizacja, logowanie, etc.)];
    R --> S{Określ imagePath z mocków (użyteczny obrazek vs. null)};
    S --> T{Jeśli imagePath z mocków nieużyteczny LUB 'default.jpg'};
    T -- Tak --> U[Spróbuj pobrać obrazek z fallbackImageMap];
    U --> V[Jeśli brak w fallbacku, ustaw 'default.jpg'];
    T -- Nie --> W[Użyj imagePath z mocków];
    V --> X[Dodaj mockowany produkt do productsMap];
    W --> X;
    P -- Koniec mockowanych produktów --> Y[Konwertuj productsMap na tablicę produktów];
    Y --> Z[Dla getFavoriteProducts: ogranicz do 3 produktów];
    Z --> AA[Zwróć finalną listę produktów];
    E -- Błąd/brak produktów z API --> BB[Zwróć wszystkie mockowane produkty jako ostateczny fallback];
