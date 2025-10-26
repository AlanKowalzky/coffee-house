# Auth flows — Rejestracja i Logowanie (Mermaid)

Diagram pokazuje szczegółowy flow dla stron Rejestracji i Logowania zgodnie z wymaganiami: walidacje on blur, blokowanie przycisków, loader przy wysyłaniu, obsługa błędów i zachowanie po sukcesie.

```mermaid
flowchart TD
  subgraph LoginFlow [Logowanie]
    L1[Otwórz modal logowania / strona login] --> L2[User wpisuje login oraz hasło]
    L2 --> L3[Walidacja on blur dla pola login]
    L2 --> L4[Walidacja on blur dla pola password]
    L3 --> L5{Pola poprawne?}
    L4 --> L5
    L5 -- Nie --> L6[Zablokuj przycisk Login, pokaż błędy pod polami]
    L5 -- Tak --> L7[Włącz przycisk Login]
    L7 --> L8[Użytkownik klika Login]
    L8 --> L9[Włącz loader; zablokuj przycisk (disable)]
    L9 --> L10[Wyślij request do backendu /auth/login]
    L10 -- Błąd --> L11[Pokaż "Incorrect login or password" pod formularzem; usuń loader; odblokuj przycisk]
    L10 -- Sukces --> L12[Zapisz user do localStorage; update UI; przekieruj na Menu]
  end

  subgraph RegisterFlow [Rejestracja]
    R1[Otwórz modal rejestracji / strona register] --> R2[User wypełnia pola: login, email, password, confirm, city, street, house, payment]
    R2 --> R3[Walidacja on blur: login rules, password rules, confirm match, house >1, email format]
    R3 --> R4{Wszystkie pola poprawne?}
    R4 -- Nie --> R5[Zablokuj przycisk Register; pokaż komunikaty pod polami]
    R4 -- Tak --> R6[Włącz przycisk Register]
    R6 --> R7[Użytkownik klika Register]
    R7 --> R8[Włącz loader; zablokuj przycisk]
    R8 --> R9[Wyślij request do backendu /auth/register z danymi]
    R9 -- Błąd --> R10[Pokaż komunikat błędu (z backend); usuń loader; odblokuj przycisk]
    R9 -- Sukces --> R11[Pokaż komunikat "Registration successful"; przełącz na Login lub automatycznie zaloguj]
  end

  %% Shared behaviors and notes
  L12 --> S1[UI: pokaż imię użytkownika; pokaż koszyk; zastosuj ceny zniżkowe]
  R11 --> S2[Opcjonalnie automatyczne logowanie lub redirect do Login]

  classDef io fill:#fff7e6,stroke:#ffb86b;
  classDef err fill:#ffe6e6,stroke:#ff6666;
  classDef ok fill:#e6ffea,stroke:#33aa33;

  L11:::err
  R10:::err
  L12:::ok
  R11:::ok

  %% Implementation hints
  subgraph Hints [Wskazówki implementacyjne]
    H1[Walidacja: on blur -> pokaż wiadomość i ustaw aria-describedby]
    H2[Przyciski: disabled aż walidacja przejdzie; podczas requestu disabled + aria-busy]
    H3[Loader: wyświetl lokalnie przy formularzu (overlay tylko na modalach)]
    H4[Backend errors: mapuj komunikaty i pokaż pod formularzem]
    H5[Persistence: store user in localStorage as JSON; użyj danych do warunkowego renderu cen w menu]
  end

  S1 --> H5
  R11 --> H2
  L8 --> H3
```
