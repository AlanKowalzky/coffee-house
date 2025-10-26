```mermaid
graph TD
    subgraph "Faza 1: Konfiguracja ESLint"
        A[Start: Uruchomienie `npm run lint`] --> B{Błąd: Brak konfiguracji `@typescript-eslint/recommended`};
        B --> C[Hipoteza: Nieaktualne zależności];
        C --> D[Akcja: Aktualizacja `eslint`, `typescript-eslint-plugin`, `typescript-eslint-parser`];
        D --> E{Błąd: ESLint v9 wymaga `eslint.config.js`};
        E --> F[Akcja: Utworzenie `eslint.config.js` i usunięcie `.eslintrc.js`];
        F --> G{Błąd: Brak modułu `typescript-eslint`};
        G --> H[Akcja: Instalacja `typescript-eslint`];
        H --> I{Błąd: Nieznana reguła `@typescript-eslint/prefer-const`};
        I --> J[Akcja: Poprawa reguły na `prefer-const`];
        J --> K[<font color=green>Sukces: Linter działa, znaleziono 20 błędów w kodzie</font>];
    end

    subgraph "Faza 2: Weryfikacja typów TypeScript"
        L[Start: Uruchomienie `npm run type-check`] --> M{Błąd TS2673: Prywatny konstruktor `ErrorMessage`};
        M --> N[Akcja: Zmiana `new ErrorMessage()` na `ErrorMessage.getInstance()`];
        N --> O[Uruchomienie `npm run type-check`];
        O --> P{<font color=red>Błąd TS2554</font><br/>`Expected 1 arguments, but got 0.`<br/>w `Auth.ts` linie 130, 153};
    end

    subgraph "Faza 3: Debugowanie 'Błędu Widmo' (TS2554)"
        P --> Q[Hipoteza 1: Mylący błąd, problem z argumentami];
        Q --> R[Akcja: Użycie `(error as Error).message` w `catch`];
        R --> S[Wynik: <font color=red>Błąd bez zmian</font>];
        S --> T[Akcja: Jawne przekazanie drugiego argumentu `duration: 5000`];
        T --> U[Wynik: <font color=red>Błąd bez zmian</font>];
        
        U --> V[Hipoteza 2: Uszkodzony cache kompilatora];
        V --> W[Akcja: Zmiana nazwy metody `show()` na `display()`];
        W --> X{Wynik: <font color=red>Błąd w Auth.ts bez zmian</font>,<br/>nowy, oczekiwany błąd w `menu.ts`};
        X --> Y[Akcja: Poprawa błędu w `menu.ts`];

        Y --> Z[Hipoteza 3: Błąd w konkretnych liniach];
        Z --> AA[Akcja: Zakomentowanie problematycznych linii w `Auth.ts`];
        AA --> BB[Wynik: <font color=red>Błąd wciąż zgłaszany dla zakomentowanych linii!</font>];

        BB --> CC[Hipoteza 4: Uszkodzone środowisko Node.js];
        CC --> DD[Akcja: Pełne czyszczenie (`node_modules`, `dist`, `package-lock`) i `npm install`];
        DD --> EE[Wynik: <font color=red>Błąd bez zmian</font>];

        EE --> FF[Hipoteza 5: Błąd w wersji TypeScript];
        FF --> GG[Akcja: Aktualizacja TypeScript do najnowszej wersji];
        GG --> HH[Wynik: <font color=red>Błąd bez zmian</font>];
    end

    subgraph "Faza 4: Wnioski i obejście problemu"
        HH --> II[Wniosek: Błąd jest 'widmem', prawdopodobnie<br/>związanym z uszkodzonym stanem środowiska<br/>poza kontrolą projektu];
        II --> JJ[Akcja ostateczna: Usunięcie problematycznych linii z bloków `catch`];
        JJ --> KK[<font color=orange>Wynik: `type-check` wciąż zgłasza błąd dla pustych linii</font>];
        KK --> LL[<font color=red>FINAŁ: Poddanie się. Błąd jest nienaprawialny w ramach projektu.</font>];
    end

    K --> L;
```