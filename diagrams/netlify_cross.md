```mermaid
flowchart TD
  %% Sources / Users
  U[Użytkownik] -->|otwiera stronę| UI[UI: Main / Menu / Carousel / Product Cards]

  %% Data fetch
  UI --> |pobierz produkty| APIget["getProducts() / getFavoriteProducts()"]
  APIget --> FallbackHelper[fetchWithFallback(url)]
  FallbackHelper -->|próba 1: API| RemoteAPI[(Backend API)]
  RemoteAPI -- ok --> RawResp[JSON (może być {data: [...]})]
  RemoteAPI -- CORS / network / error --> LocalFallback[/products.json (statyczny)/]
  LocalFallback -- ok --> RawResp
  FallbackHelper -->|brak danych| NullResp((null))

  %% Normalize and render
  RawResp --> Normalizer[normalizeCategory(...) -> ProductCategory enum]
  Normalizer --> Products[Products[]]
  Products --> UI
  NullResp --> Mock[use getMockProducts()]

  %% Product modal flow
  UI -->|klik: produkt| ProductModal[`src/components/ProductModal.ts`]
  ProductModal -->|fetch szczegółów| APIbyId[getProductById(id)]
  APIbyId --> FallbackHelper
  APIbyId -->|normalize category| Normalizer

  ProductModal -->|wybór size/additives| Selection[Wybór klienta]
  Selection -->|dodaj| CartComp[`src/components/Cart.ts`]
  CartComp -->|zapis w localStorage| LocalStorage[(localStorage: cart, user, orderHistory)]

  %% Checkout flow
  CartComp -->|Confirm order| PlaceOrder[ApiService.placeOrder()]
  PlaceOrder -->|POST| RemoteOrders[(Backend /orders)]
  RemoteOrders -- 5xx --> Retry{status 5xx?}
  Retry -->|tak| RetryOnce[retry after backoff]
  RetryOnce --> RemoteOrders
  RemoteOrders -- ok --> OrderResp[OrderResponse]
  OrderResp -->|zapisz| LocalStorage
  OrderResp --> Toasts[`src/components/Toast.ts`]
  Retry -->|nie/failed| FallbackFlow[attempt alternate path/fallback handling]

  %% Auth flow -> affects pricing
  UI -->|open login/register| AuthComp[`src/components/Auth.ts`]
  AuthComp -->|POST| ApiAuth[ApiService.login / register]
  ApiAuth --> RemoteAPI
  ApiAuth -- success --> |save user| LocalStorage
  LocalStorage -->|logged user| UI
  UI -->|render prices| PriceLogic[`src/menu.ts` (discounts for logged users)]

  %% Logging
  RemoteAPI -->|responses| Debug[apiLog -> console]
  LocalFallback --> Debug
  PlaceOrder --> Debug
  CartComp --> Debug

  classDef service fill:#f9f,stroke:#333,stroke-width:1px;
  class APIget,APIbyId,PlaceOrder,ApiAuth,FallbackHelper service;
  class ProductModal,CartComp,AuthComp,Normalizer,Toasts,UI,LocalStorage,PriceLogic,Debug service;
  ```