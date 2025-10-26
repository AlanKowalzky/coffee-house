graph TD
    A[Początek przetwarzania produktu (w getProducts/getFavoriteProducts)] --> B[imagePathFromApi ustawione na NULL (tymczasowo, w celu diagnostyki)];
    B --> C{finalImagePath jest NULL lub 'default.jpg'?};
    C -- Tak --> D{Czy fallbackImageMap zawiera obrazek dla produktu?};
    D -- Tak --> E[Użyj obrazka z fallbackImageMap];
    D -- Nie --> F[Użyj 'default.jpg'];
    E --> G[Finalna ścieżka obrazka ustawiona];
    F --> G;
    G --> H[apiLog - Finalna ścieżka obrazka];
    H --> I[Produkt z obrazkiem gotowy do wyświetlenia];
