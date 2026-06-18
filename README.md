# 🎓 Britlex Training Center — Student Dashboard

> **Lux Modern & Interactive Educational Ecosystem** — Инновационный личный кабинет для студентов, преподавателей и администраторов с умной синхронизацией через Telegram-бота.

<p align="center">
  <img src="./images/UI.png" alt="Britlex Training Center UI" width="100%">
</p>

![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-REST_API-000000?style=for-the-badge&logo=flask&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Protected-000000?style=for-the-badge&logo=json-web-tokens&logoColor=pink)

---

## 🛠️ Технологический стек / Tech Stack

### 🚀 Frontend
* **React 19 (Vite):**
* **Tailwind CSS v4:**
* **Framer Motion / Gsap:**
* **i18next:**  
* **Axuis:** 

### 🐍 Backend & Integrations
* **Python 3 / Flask:**
* **Security Cross-Origin:** 
* **Telegram Bot:** 
* **Storage:**

### 🔐 Security & Admin Panel
* **JWT Tokens:** 
* **Middleware:**
* **Hash Passwords:**  
* **Control Panel:** 

### 🗄️ Database & Storage
* **DB:**  
* **ORM:**  
* **Migrations** 

---


## ✨ Основные возможности / Features

### 👥 Пользователи

* ✅ 🔐 JWT Authentication
* ✅ 👨‍🎓 Student Dashboard
* ✅ 👨‍🏫 Teacher Dashboard
* ✅ 👨‍💼 Admin Dashboard
* ✅ 🔒 Role-Based Access Control

### 🎨 Интерфейс

* ✅ 🌙 Dark / Light Theme
* ✅ 🌍 Multi-language (i18next)
* ✅ 📱 Fully Responsive Design

### ⚙️ Система

* ✅ ⚡ High Performance REST API
* ✅ 🤖 Telegram Bot Notifications
* ✅ 📊 Analytics Dashboard


## 🗺️ Архитектура системы

```mermaid
graph TD
    %% Стилизация узлов
    classDef client fill:#0f172a,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef server fill:#022c22,stroke:#34d399,stroke-width:2px,color:#f0fdf4;
    classDef db fill:#1c1917,stroke:#fb923c,stroke-width:2px,color:#fff7ed;
    classDef bot fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#e0e7ff;

    %% Компоненты Фронтенда
    subgraph Frontend [React Client - Vite & Tailwind v4]
        UI[🖥️ UI Components / Pages]:::client
        AxiosClient[🔄 Axios API Client]:::client
        AuthContext[🔐 Auth Context & JWT]:::client
    end

    %% Компоненты Бэкенда
    subgraph Backend [Flask REST Server]
        AppPy[🐍 app.py / Entry Point]:::server
        Routes[🛣️ routes/ API Blueprints]:::server
        Models[📊 models.py / SQLAlchemy ORM]:::server
    end

    %% База данных и Внешние сервисы
    subgraph Storage [Внешняя среда & СХД]
        DB[(🗄️ instance/users.db)]:::db
        TGBot[🤖 Telegram Bot @britlex_bot]:::bot
    end

    %% Потоки данных и связи
    UI -->|Взаимодействие| AuthContext
    AuthContext -->|HTTP Запросы + Bearer JWT| AxiosClient
    AxiosClient -->|REST API / HTTPS| Routes
    Routes -->|Маршрутизация| AppPy
    AppPy <-->|ORM Сессии| Models
    Models <-->|Чтение/Запись SQL| DB
    Routes -->|Вызов Bot API / Webhooks| TGBot

```
### 🤖 Архитектура взаимодействия Telegram-бота

```mermaid
graph TD
    %% Строгие минималистичные стили
    classDef actorStyle fill:#1e293b,stroke:#0f172a,stroke-width:1.5px,color:#fff,rx:6px,ry:6px;
    classDef techStyle fill:#f8fafc,stroke:#cbd5e1,stroke-width:1.5px,color:#0f172a,rx:6px,ry:6px;
    classDef dbStyle fill:#ffffff,stroke:#94a3b8,stroke-width:1.5px,color:#0f172a;

    %% Элементы схемы
    A(👨‍🏫 Преподаватель):::actorStyle
    B(🐍 Flask Backend):::techStyle
    C(🤖 Telegram Bot):::techStyle
    D(👨‍🎓 Студент):::actorStyle
    E[(🗄️ SQLite DB)]:::dbStyle

    %% Вертикальные потоки данных
    A -->|1. Создает задачу в UI| B
    B -->|2. POST-запрос к API| C
    C -->|3. Push-уведомление| D
    D -.->|"4. Команда /done id"| C
    C -.->|"5. Callback / Webhook"| B
    B -->|6. Запись прогресса| E

    %% Тонкая настройка стилей для линий
    linkStyle default stroke:#64748b,stroke-width:1px;
    linkStyle 3,4 stroke:#94a3b8,stroke-width:1px,stroke-dasharray: 4;
```

```text
learning-center/
│
├── 📁 backend/                        # Flask REST API
│   ├── 📄 app.py                      # Точка входа Flask
│   ├── 📄 models.py                   # Модели базы данных
│   ├── 📄 requirements.txt            # Python зависимости
│   ├── 🔐 localhost.pem               # SSL сертификат
│   ├── 🔐 localhost-key.pem           # SSL ключ
│   │
│   ├── 📁 instance/                   # Локальные данные
│   │   └── 📄 users.db                # SQLite база
│   │
│   ├── 📁 routes/                     # REST API маршруты
│   └── 📁 venv/                       # Виртуальное окружение
│
├── 📁 frontend/                       # React приложение
│   ├── 📄 index.html                  # HTML шаблон
│   ├── 📄 vite.config.js              # Конфигурация Vite
│   ├── 📄 package.json                # npm зависимости
│   ├── 📄 tailwind.config.js          # Настройки Tailwind
│   │
│   ├── 📁 public/                     # Публичные файлы
│   │
│   └── 📁 src/                        # Исходный код
│       ├── 📄 main.jsx                # Точка входа
│       ├── 📄 App.jsx                 # Главный компонент
│       ├── 📄 index.css               # Глобальные стили
│       ├── 📄 App.css                 # Дополнительные стили
│       │
│       ├── 📁 api/                    # API функции
│       │   └── 📄 telegram.js         # Telegram API
│       │
│       ├── 📁 assets/                 # Медиа ресурсы
│       │
│       ├── 📁 hooks/                  # React Hooks
│       │   ├── 📄 useAuth.js          # Авторизация
│       │   └── 📄 useTheme.js         # Смена темы
│       │
│       ├── 📁 i18n/                   # Локализация
│       │
│       ├── 📁 services/               # HTTP сервисы
│       │   └── 📄 axios.js            # Axios клиент
│       │
│       ├── 📁 routes/                 # React Router
│       │   ├── 📄 AppRoutes.jsx       # Все маршруты
│       │   ├── 📄 ProtectedRoutes.jsx # Защита маршрутов
│       │   └── 📄 Roles.jsx           # Роли доступа
│       │
│       ├── 📁 context/                # React Context
│       │   ├── 📁 auth/               # Авторизация
│       │   │   └── 📄 AuthContext.jsx # Auth Context
│       │   │
│       │   └── 📁 theme/              # Тема приложения
│       │       └── 📄 ThemeContext.jsx# Theme Context
│       │
│       ├── 📁 components/             # UI компоненты
│       │   ├── 📁 layout/             # Макеты страниц
│       │   │   ├── 📁 admin/          # Админ интерфейс
│       │   │   ├── 📁 footer/         # Подвал сайта
│       │   │   └── 📁 navbar/         # Навигация
│       │   │
│       │   └── 📁 ui/                 # Базовые элементы
│       │       ├── 📁 button/         # Кнопки
│       │       ├── 📁 loader/         # Индикаторы загрузки
│       │       └── 📁 modal/          # Модальные окна
│       │
│       └── 📁 pages/                  # Страницы сайта
│           ├── 📁 Admin/              # Админ панель
│           ├── 📁 Auth/               # Авторизация
│           ├── 📁 Forbidden/          # Ошибка 403
│           ├── 📁 Home/               # Главная страница
│           ├── 📁 Legal/              # Правовая информация
│           ├── 📁 NotFound/           # Ошибка 404
│           ├── 📁 Profile/            # Профиль пользователя
│           └── 📁 Teacher/            # Кабинет преподавателя
│
└── 📁 images/                         # Скриншоты проекта
    ├── 🖼️ UI.png                      # Интерфейс студента
    ├── 🖼️ adminDashboard.png          # Панель администратора
    ├── 🖼️ teacherGiveTask.png         # Выдача заданий
    └── 🖼️ database.png                # Схема БД
```



# 📸 Project Preview

| Student Dashboard | Administrator Dashboard |
|:-----------------:|:-----------------------:|
| Современный интерфейс студента | Управление системой |
| <img src="./images/adminDashboard.png" width="100%"> |

| Teacher Dashboard | Database Schema |
|:-----------------:|:---------------:|
| Выдача заданий студентам | Структура базы данных |
| <img src="./images/teacherGiveTask.png" width="100%"> | <img src="./images/database.png" width="100%"> |
