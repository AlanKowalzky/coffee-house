# Figma Export Guide - Coffee House

## Jak eksportować zasoby z Figmy

```mermaid
flowchart TD
    A[Otwórz Figma Design] --> B[Duplikuj do Drafts]
    B --> C[Wybierz elementy do eksportu]
    C --> D{Typ zasobu}
    
    D -->|Obrazy| E[Eksport obrazów]
    D -->|Ikony| F[Eksport ikon SVG]
    D -->|Kolory| G[Kopiuj hex kody]
    D -->|Fonty| H[Sprawdź Google Fonts]
    
    E --> E1[Zaznacz obrazy produktów]
    E --> E2[Export → PNG/JPG]
    E --> E3[Rozdzielczość 2x dla Retina]
    E --> E4[Zapisz jako coffee-1.jpg etc.]
    
    F --> F1[Zaznacz ikony]
    F --> F2[Export → SVG]
    F --> F3[Zapisz jako logo.svg etc.]
    
    G --> G1[Sprawdź Style Guide]
    G --> G2[Kopiuj kolory do CSS]
    G --> G3[Aktualizuj zmienne CSS]
    
    H --> H1[Sprawdź używane fonty]
    H --> H2[Dodaj Google Fonts link]
    H --> H3[Aktualizuj font-family w CSS]
    
    E4 --> I[Umieść w assets/]
    F3 --> I
    G3 --> J[Aktualizuj CSS]
    H3 --> J
    
    I --> K[Przetestuj w przeglądarce]
    J --> K
```

## Krok po krok:

### 1. **Przygotowanie Figmy:**
```
1. Otwórz link: https://www.figma.com/file/SAoBmuOqTfguehdT4IFRxQ/Coffee-House
2. Kliknij strzałkę obok nazwy → "Duplicate to your drafts"
3. Otwórz swoją kopię z "In Drafts"
```

### 2. **Export obrazów produktów:**
```
1. Zaznacz obrazy kawy w sekcji Favourites
2. Prawy panel → Export
3. Format: JPG, 2x resolution
4. Nazwij: coffee-1.jpg, coffee-2.jpg, etc.
5. Zapisz w assets/
```

### 3. **Export ikon SVG:**
```
1. Zaznacz logo Coffee House
2. Export → SVG
3. Zapisz jako logo.svg
4. Powtórz dla ikon social media, kategorii menu
```

### 4. **Kolory z Style Guide:**
```
1. Sprawdź panel Style Guide w Figmie
2. Skopiuj hex kody kolorów
3. Aktualizuj CSS variables:
   --primary-brown: #403F3D
   --secondary-beige: #E1D4C9
   --accent-brown: #B0907A
```

### 5. **Fonty:**
```
1. Sprawdź używane fonty (prawdopodobnie Inter)
2. Dodaj do HTML:
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
```

## Potrzebne zasoby:

### Obrazy:
- coffee-1.jpg do coffee-8.jpg (karuzela)
- about-1.jpg, about-2.jpg (sekcja About)
- mobile-screens.png (sekcja Mobile App)
- video.mp4 (background Enjoy)

### Ikony SVG:
- logo.svg
- coffee-cup.svg, tea-cup.svg, dessert.svg (kategorie menu)
- twitter.svg, instagram.svg, facebook.svg (social)
- apple.svg, google.svg (app store)
- pin-alt.svg, phone.svg, clock.svg (kontakt)

### Favicon:
- Wyeksportuj logo jako 32x32 PNG
- Konwertuj na favicon.ico online