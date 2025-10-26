# Analiza Komponentu: Auth.ts

```mermaid
mindmap
  root((Auth.ts))
    ::icon(fa fa-user-shield)
    **Szczegółowa Walidacja i Pola**
      ❌ Do Zrobienia
        - Brakujące pola w formularzu rejestracji (Confirm Password, City, Street, etc.)
        - Niezgodność walidacji (wymagany "Login", zaimplementowany "Email")
        - Brak logiki porównywania haseł
    **Efekty Walidacji (on blur)**
      ❌ Do Zrobienia
        - Brak nasłuchiwania na zdarzenie 'blur'
        - Brak logiki dla czerwonej ramki i komunikatu pod polem
    **Blokowanie Przycisku 'Submit'**
      ❌ Do Zrobienia
        - Brak nasłuchiwania na zmiany w polach ('input')
        - Przycisk jest zawsze aktywny
```
