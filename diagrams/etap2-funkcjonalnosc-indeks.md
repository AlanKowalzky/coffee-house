# ETAP 2: JavaScript Funkcjonalność - Indeks Diagramów

Szczegółowe diagramy funkcjonalności JavaScript dla projektu Coffee House.

## Diagramy Funkcjonalności

1. **[Burger Menu](etap2-burger-menu.md)**
   - Stany menu (zamknięte/otwarte)
   - Animacje transformacji
   - Responsive behavior

2. **[Karuzela](etap2-karuzela.md)**
   - Auto-scroll z timerem
   - Progress bar animation
   - Manual controls i touch support

3. **[Menu Management](etap2-menu-management.md)**
   - Ładowanie produktów z JSON
   - Filtrowanie kategorii
   - Load More functionality

4. **[Modal System](etap2-modal-system.md)**
   - Otwieranie/zamykanie modala
   - Price calculator
   - Size i additives selection

5. **[Responsive Behavior](etap2-responsive-behavior.md)**
   - Breakpoint handling
   - Layout switching
   - Touch vs hover interactions

## Kluczowe Funkcjonalności

### ✅ **Burger Menu (+22 punkty)**
- Pojawia się ≤768px
- Animacja burger → cross
- Slide z prawej strony
- Auto-zamykanie przy resize

### ✅ **Karuzela (+24 punkty)**
- Auto-scroll co 5-7 sekund
- Progress bar z animacją
- Pause na hover
- Manual controls + touch swipe
- Cykliczne przechodzenie

### ✅ **Menu Categories (+16 punkty)**
- Coffee domyślnie aktywna
- Przełączanie kategorii
- Mobile: 4 produkty + Load More
- Responsive bez przeładowania

### ✅ **Modal (+20 punkty)**
- Otwiera się po kliknięciu karty
- Darkened overlay
- Size selection (S/M/L)
- Additives checkboxes
- Dynamic price calculation

### ✅ **Video Background (+8 punkty)**
- Autoplay bez dźwięku
- Loop po zakończeniu
- Brak kontrolek

## Status Implementacji

🟢 **UKOŃCZONE:**
- Wszystkie pliki JavaScript
- CSS dla animacji i responsive
- Diagramy funkcjonalności

🔄 **NASTĘPNE KROKI:**
- Testowanie funkcjonalności
- Dodanie zasobów (obrazy, video)
- Finalne poprawki CSS