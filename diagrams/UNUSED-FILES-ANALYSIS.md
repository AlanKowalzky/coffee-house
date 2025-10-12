# Analiza nieużywanych plików

## ✅ UŻYWANE PLIKI:

### HTML (index.html):
- `assets/logo.svg` - logo w header
- `assets/coffee-slider-1.png` - karuzela slajd 1
- `assets/coffee-slider-2.png` - karuzela slajd 2  
- `assets/coffee-slider-3.png` - karuzela slajd 3
- `assets/coffee-1.png` - karuzela slajd 2
- `assets/coffee-2.jpg` - karuzela slajd 2 + about img-1
- `assets/coffee-3.jpg` - karuzela slajd 2
- `assets/coffee-4.jpg` - karuzela slajd 3 + about img-2
- `assets/coffee-5.jpg` - karuzela slajd 3
- `assets/coffee-6.jpg` - mobile app image
- `assets/twitter.svg` - social link
- `assets/instagram.svg` - social link
- `assets/facebook.svg` - social link
- `assets/pin-alt.svg` - contact address icon
- `assets/phone.svg` - contact phone icon
- `assets/clock.svg` - contact hours icon
- `assets/apple.svg` - app store button
- `assets/google.svg` - google play button
- `assets/favicon.ico` - favicon

### HTML (menu.html):
- `assets/logo.svg` - logo w header
- `assets/coffee-cup.svg` - coffee tab icon
- `assets/tea-cup.svg` - tea tab icon
- `assets/dessert.svg` - dessert tab icon
- `assets/twitter.svg` - social link
- `assets/instagram.svg` - social link
- `assets/facebook.svg` - social link
- `assets/pin-alt.svg` - contact address icon
- `assets/phone.svg` - contact phone icon
- `assets/clock.svg` - contact hours icon

### JavaScript (menu.js):
- `assets/coffee-1.png` - coffee product 1
- `assets/coffee-2.jpg` - coffee product 2
- `assets/coffee-3.jpg` - coffee product 3
- `assets/coffee-4.jpg` - coffee product 4
- `assets/coffee-5.jpg` - coffee product 5
- `assets/coffee-6.jpg` - coffee product 6
- `assets/coffee-7.jpg` - coffee product 7
- `assets/coffee-8.jpg` - coffee product 8
- `assets/tea-1.png` - tea product 1
- `assets/tea-2.png` - tea product 2
- `assets/tea-3.png` - tea product 3
- `assets/tea-4.png` - tea product 4
- `assets/dessert-1.png` - dessert product 1
- `assets/dessert-2.png` - dessert product 2
- `assets/dessert-3.png` - dessert product 3
- `assets/dessert-4.png` - dessert product 4
- `assets/dessert-5.png` - dessert product 5
- `assets/dessert-6.png` - dessert product 6
- `assets/dessert-7.png` - dessert product 7
- `assets/dessert-8.png` - dessert product 8

## ❌ NIEUŻYWANE PLIKI:

### Placeholder'y (małe pliki):
- `assets/coffee-1.jpg` (65 bytes) - placeholder, używany jest coffee-1.png
- `assets/about-1.jpg` (63 bytes) - placeholder, używany jest coffee-2.jpg
- `assets/about-2.jpg` (57 bytes) - placeholder, używany jest coffee-4.jpg
- `assets/mobile-screens.png` (70 bytes) - placeholder, używany jest coffee-6.jpg
- `assets/video.mp4` (71 bytes) - placeholder, video usunięte z HTML

### Archiwa z Figmy:
- `Coffee House (Copy) (1).zip` - archiwum z Figmy
- `Coffee House (Copy).zip` - archiwum z Figmy

## 🗑️ PLIKI DO USUNIĘCIA:

```bash
# Usuń placeholder'y
del assets\coffee-1.jpg
del assets\about-1.jpg  
del assets\about-2.jpg
del assets\mobile-screens.png
del assets\video.mp4

# Usuń archiwa
del "assets\Coffee House (Copy) (1).zip"
del "assets\Coffee House (Copy).zip"
```

## 📊 PODSUMOWANIE:

### Używane pliki: 37
- 13 ikon SVG
- 3 obrazy karuzeli (coffee-slider-X.png)
- 8 obrazów kawy (coffee-1.png + coffee-2-8.jpg)
- 4 obrazy herbaty (tea-1-4.png)
- 8 obrazów deserów (dessert-1-8.png)
- 1 favicon

### Nieużywane pliki: 7
- 5 placeholder'ów (małe pliki tekstowe)
- 2 archiwa ZIP z Figmy

### Oszczędność miejsca:
- Placeholder'y: ~400 bytes (nieznaczące)
- Archiwa ZIP: prawdopodobnie kilka MB

**Zalecenie: Usuń nieużywane pliki aby oczyścić projekt.**