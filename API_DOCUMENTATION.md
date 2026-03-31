# API Documentation — messenger-web

> Документация описывает интеграцию frontend (Vue 3) с backend (Go).
> Всё основано исключительно на коде проекта.

---

## Содержание

1. [Конфигурация и окружение](#1-конфигурация-и-окружение)
2. [HTTP-клиент и авторизация](#2-http-клиент-и-авторизация)
3. [Эндпоинты](#3-эндпоинты)
4. [WebSocket](#4-websocket)
5. [Состояние приложения (Pinia)](#5-состояние-приложения-pinia)
6. [Роутер и защита маршрутов](#6-роутер-и-защита-маршрутов)
7. [Карта: экран → компонент → API-вызов → backend](#7-карта-экран--компонент--api-вызов--backend)
8. [Обработка ошибок](#8-обработка-ошибок)
9. [Замечания и проблемные места](#9-замечания-и-проблемные-места)

---

## 1. Конфигурация и окружение

**Файл:** `.env`

```env
VITE_API_URL=http://5.42.112.133:8080
VITE_WS_URL=ws://5.42.112.133:8080
```

Переменные подхватываются через `import.meta.env` (механизм Vite). Если переменная не задана, используются fallback-значения:

| Переменная       | Используется в             | Fallback                  |
|------------------|----------------------------|---------------------------|
| `VITE_API_URL`   | `src/api/client.ts`        | `http://localhost:8080`   |
| `VITE_WS_URL`    | `src/services/ws.ts`       | `ws://localhost:8080`     |

---

## 2. HTTP-клиент и авторизация

**Файл:** `src/api/client.ts`

Создаётся единственный экземпляр Axios с `baseURL` из env:

```ts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
})
```

### Request-интерцептор

Перед каждым запросом интерцептор читает токен из `localStorage` и добавляет заголовок:

```
Authorization: Bearer <token>
```

Ключ в localStorage: `"token"` (строка JWT).

Если токена нет — заголовок не добавляется (запрос уйдёт без авторизации).

**Токен не декодируется и не проверяется на срок действия** перед отправкой запроса — это происходит только при инициализации стора (`src/stores/auth.ts`).

---

## 3. Эндпоинты

### 3.1 POST `/login`

**Файл вызова:** `src/api/auth.ts`, функция `login()`
**Вызывается из:** `src/views/LoginView.vue`, функция `doLogin()`
**Авторизация:** не требуется

**Запрос:**
```json
{
  "login": "string",
  "password": "string"
}
```

**Ответ (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ответ при ошибке (400 / 401):**
```json
{
  "error": "invalid credentials"
}
```

После получения токена:
1. Вызывается `auth.setToken(token)` из `src/stores/auth.ts`
2. Токен сохраняется в `localStorage['token']`
3. Из токена декодируются `user_id` и `login` через `jwtDecode` (библиотека `jwt-decode`)
4. Роутер перенаправляет на `/chat`

---

### 3.2 POST `/register`

**Файл вызова:** `src/api/auth.ts`, функция `register()`
**Вызывается из:** `src/views/LoginView.vue`, функция `doRegister()`
**Авторизация:** не требуется

**Запрос:**
```json
{
  "login": "string",
  "password": "string"
}
```

> ⚠️ **Этот эндпоинт отсутствует в backend.** Вызов всегда завершается ошибкой (404). Пользователи создаются только напрямую через БД. Подробнее — в `BACKEND_DOCUMENTATION.md`.

После `register()` сразу вызывается `login()` — если регистрация упала с ошибкой, блок `catch` в `doRegister()` выводит `"Registration failed. Login may already be taken."`.

---

### 3.3 GET `/users`

**Файл вызова:** `src/api/users.ts`, функция `getUsers()`
**Вызывается из:** `src/views/ChatView.vue`, хук `onMounted()`
**Авторизация:** `Authorization: Bearer <token>` (обязательно)

**Ответ (200):**
```json
[
  {
    "id": "uuid",
    "login": "string",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

Результат записывается в `chat.setUsers(users)` (`src/stores/chat.ts`).

> ⚠️ Возвращает **всех** пользователей включая текущего. Фильтрация (`u.id !== auth.userId`) происходит только на стороне UI в `src/components/UserList.vue` (computed `filteredUsers`).

---

### 3.4 GET `/messages?user_id=<UUID>`

**Файл вызова:** `src/api/messages.ts`, функция `getMessages(userId)`
**Вызывается из:** `src/views/ChatView.vue`, функция `selectUser(user)`
**Авторизация:** `Authorization: Bearer <token>` (обязательно)

**Query-параметр:** `user_id` — UUID собеседника

**Ответ (200):**
```json
[
  {
    "id": "uuid",
    "sender_id": "uuid",
    "receiver_id": "uuid",
    "text": "string",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

Результат записывается в `chat.setMessages(msgs ?? [])`.

> **Важно:** оператор `?? []` добавлен намеренно — backend возвращает JSON `null` (а не `[]`) когда история пуста (Go nil-срез). Без этой защиты `messages.value.push()` падал бы с `TypeError`.

---

## 4. WebSocket

**Файл:** `src/services/ws.ts`
**Класс:** `WsService` (singleton, экспортируется как `wsService`)

### Подключение

URL подключения:
```
ws://<VITE_WS_URL>/ws?token=<JWT>
```

Токен передаётся в query-параметре, **не в заголовке** — это единственный способ авторизации WebSocket, так как браузерный `WebSocket API` не поддерживает произвольные заголовки.

Подключение инициируется в `src/views/ChatView.vue`, хук `onMounted()`:
```ts
wsService.connect(auth.token!)
```

### Формат входящего сообщения (сервер → клиент)

```json
{
  "from": "uuid отправителя",
  "to": "uuid получателя",
  "text": "текст сообщения"
}
```

### Формат исходящего сообщения (клиент → сервер)

```json
{
  "type": "send_message",
  "to": "uuid получателя",
  "text": "текст сообщения"
}
```

Отправка: `src/components/MessageInput.vue`, функция `send()` → `wsService.send(to, text)`

### Приём сообщений

Callback регистрируется в `ChatView.vue` через `wsService.onMessage(cb)`.
Условие добавления сообщения в стор:

```ts
if (
  chat.activeUser &&
  (msg.from === chat.activeUser.id || msg.to === chat.activeUser.id)
)
```

Это позволяет отображать как входящие (`msg.from === activeUser`), так и исходящие (`msg.to === activeUser`) сообщения.

### Переподключение (Reconnect)

Реализован exponential backoff:

| Параметр | Значение |
|----------|----------|
| Начальная задержка | 2 секунды |
| Максимальная задержка | 30 секунд |
| Множитель | ×2 при каждой неудаче |
| Сброс | при успешном `onopen` |

При вызове `wsService.disconnect()` (`doLogout` в `ChatView.vue`) переподключение **не происходит** — флаг `manualClose = true` предотвращает его.

### Жизненный цикл

```
connect(token)
  └─ _open()
       ├─ onopen  → reconnectDelay = 2000
       ├─ onmessage → onMessageCb?.(msg)
       ├─ onerror → ws.close()
       └─ onclose → если !manualClose: setTimeout(_open, delay * 2)

disconnect()
  └─ manualClose = true
     clearTimeout(reconnectTimer)
     ws.close()
```

---

## 5. Состояние приложения (Pinia)

### `src/stores/auth.ts` — useAuthStore

| Поле / метод | Тип | Описание |
|---|---|---|
| `token` | `Ref<string \| null>` | JWT-токен, инициализируется из `localStorage` |
| `userId` | `Ref<string \| null>` | Декодируется из JWT (`payload.user_id`) |
| `login` | `Ref<string \| null>` | Декодируется из JWT (`payload.login`) |
| `setToken(t)` | функция | Сохраняет токен в `localStorage` + декодирует |
| `logout()` | функция | Очищает все поля + `localStorage` |

При инициализации стора, если `localStorage['token']` содержит невалидный JWT, токен автоматически удаляется из `localStorage` (блок `try/catch`).

### `src/stores/chat.ts` — useChatStore

| Поле / метод | Тип | Описание |
|---|---|---|
| `users` | `Ref<User[]>` | Все пользователи с сервера |
| `activeUser` | `Ref<User \| null>` | Выбранный собеседник |
| `messages` | `Ref<Message[]>` | Сообщения текущего диалога |
| `setUsers(list)` | функция | Перезаписывает список пользователей |
| `setActiveUser(user)` | функция | Устанавливает собеседника + **очищает `messages`** |
| `setMessages(list)` | функция | Устанавливает историю сообщений |
| `addMessage(msg)` | функция | Добавляет одно сообщение (для WS) |

---

## 6. Роутер и защита маршрутов

**Файл:** `src/router/index.ts`

| Маршрут | Компонент | Защита |
|---------|-----------|--------|
| `/` | `LoginView.vue` | нет |
| `/chat` | `ChatView.vue` | `beforeEnter`: проверяет `localStorage['token']` |

Защита маршрута `/chat` — **только по наличию токена в localStorage**, без проверки его валидности или срока действия. Если токен истёк, пользователь попадёт в `/chat`, но все API-запросы вернут `401`.

---

## 7. Карта: экран → компонент → API-вызов → backend

```
LoginView.vue
  ├── doLogin()
  │     └── api/auth.ts: login(login, password)
  │           └── POST /login  →  { token }
  │                 └── auth.setToken(token)
  │                       └── router.push('/chat')
  │
  └── doRegister()
        └── api/auth.ts: register(login, password)
              └── POST /register  →  404 (не реализован)

ChatView.vue [onMounted]
  ├── api/users.ts: getUsers()
  │     └── GET /users  →  User[]
  │           └── chat.setUsers(users)
  │
  └── wsService.connect(token)
        └── WS /ws?token=JWT

ChatView.vue [selectUser(user)]
  ├── chat.setActiveUser(user)   ← очищает messages
  └── api/messages.ts: getMessages(user.id)
        └── GET /messages?user_id=UUID  →  Message[]
              └── chat.setMessages(msgs ?? [])

ChatView.vue [wsService.onMessage]
  └── получение WS-сообщения → chat.addMessage(msg)

MessageInput.vue [send()]
  └── wsService.send(activeUser.id, text)
        └── WS: { type: "send_message", to, text }

UserList.vue [doLogout()]
  └── wsService.disconnect()
      auth.logout()
      router.push('/')
```

---

## 8. Обработка ошибок

| Место | Обработка |
|---|---|
| `LoginView.vue` → `doLogin()` | `catch` → `error.value = 'Invalid credentials'`, отображается в UI |
| `LoginView.vue` → `doRegister()` | `catch` → `error.value = 'Registration failed...'` |
| `ChatView.vue` → `selectUser()` | **нет try/catch** — ошибка `getMessages` уходит в unhandled rejection |
| `ChatView.vue` → `onMounted` → `getUsers()` | **нет try/catch** — ошибка уходит в unhandled rejection |
| `WsService._open()` → `onerror` | вызывает `ws.close()`, что триггерит `onclose` и авто-реконнект |
| `WsService.send()` | тихо игнорирует, если `readyState !== OPEN` |
| `auth.ts` инициализация | `try/catch` при декодировании JWT — при ошибке токен удаляется |

---

## 9. Замечания и проблемные места

### Критические

**`POST /register` не реализован на backend**
Функция `register()` в `src/api/auth.ts` вызывает несуществующий эндпоинт. Регистрация через UI невозможна.

### Средние

**Нет обработки ошибок в `selectUser()` и `onMounted()`**
Если `GET /users` или `GET /messages` упадёт с ошибкой, пользователь ничего не увидит — ни сообщения об ошибке, ни индикатора. Ошибка уходит в `console.error` браузера.

**Защита маршрута `/chat` не проверяет срок JWT**
`beforeEnter` проверяет только факт наличия строки в `localStorage`, не её валидность. Пользователь с истёкшим токеном попадёт в чат и получит `401` на все запросы.

**Список пользователей не фильтруется на backend**
`GET /users` возвращает всех пользователей включая текущего. Фильтрация делается в computed `filteredUsers` в `UserList.vue`. При большом числе пользователей это расточительно.

### Незначительные

**Отсутствует индикатор подключения WebSocket**
Пользователь не видит, установлено ли WS-соединение. При первом реконнекте (задержка 2с) отправленные сообщения молча теряются.

**Last message не отображается в списке диалогов**
`UserList.vue` показывает статичный текст вместо превью последнего сообщения — в store нет хранения последних сообщений по пользователям.

**Нет пагинации**
`GET /messages` загружает всю историю диалога целиком без лимита.
