# Analiza Komponentu: Cart.ts

```mermaid
mindmap
  root((Cart.ts))
    ::icon(fa fa-shopping-cart)
    **Utrwalanie (Local Storage)**
      )✅ Zrobione(
        - Wczytywanie stanu koszyka przy starcie (`loadCart`)
        - Zapisywanie stanu po każdej modyfikacji (`saveCart`)
    **Wyświetlanie i Usuwanie**
      )✅ Zrobione(
        - Poprawne renderowanie wszystkich danych produktu w koszyku
        - Działająca funkcja usuwania pozycji z koszyka
    **Składanie Zamówienia**
      )🟡 Częściowo Zrobione(
        - ✅ Obsługa sukcesu i błędu
        - ✅ Czyszczenie koszyka po udanym zamówieniu
        - ❌ Brakujący loader w trakcie wysyłania zamówienia
```
