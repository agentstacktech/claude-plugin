# Проверка плагина AgentStack (Claude Code) и его возможности

## Как проверить, что плагин работает

### 1. Установка плагина

**Вариант A: из marketplace (после публикации)**  
- Claude Code → Plugin manager / Discover → найти "AgentStack" → Install.

**Вариант B: локально (до публикации)**  
- Запуск с указанием директории плагина:
  ```bash
  claude --plugin-dir ./provided_plugins/claude-plugin
  ```
  Либо скопировать плагин в каталог, откуда Claude Code подхватывает плагины (см. [Claude Code — Plugins](https://code.claude.com/docs/en/plugins)).

### 2. Подключение MCP (обязательно для вызова инструментов)

Плагин даёт Skills, но **вызов проектов, логики, баффов и т.д. идёт через MCP**. Без настроенного MCP инструменты вызываться не будут.

1. **Получить API key**  
   - Через curl (анонимный проект):
     ```bash
     curl -X POST https://agentstack.tech/mcp/tools/projects.create_project_anonymous \
       -H "Content-Type: application/json" \
       -d '{"tool": "projects.create_project_anonymous", "params": {"name": "Test"}}'
     ```
   - Из ответа взять `project_api_key` или `user_api_key`.

2. **Добавить MCP-сервер в Claude Code**  
   ```bash
   claude mcp add --transport http agentstack https://agentstack.tech/mcp --header "X-API-Key: YOUR_KEY"
   ```

3. При необходимости перезапустить Claude Code.

Подробно: [MCP_QUICKSTART.md](MCP_QUICKSTART.md).

### 3. Проверка в чате

В чате Claude Code попросите агента:

- "Создай проект в AgentStack с названием Test Project"  
  → Ожидается вызов `projects.create_project_anonymous` (или `projects.create_project` при наличии авторизации).
- "Покажи список моих проектов в AgentStack"  
  → Ожидается `projects.get_projects`.
- "Дай статистику по проекту &lt;project_id&gt;"  
  → Ожидается `projects.get_stats`.

Если агент вызывает MCP tools и возвращает осмысленный ответ — плагин и MCP работают.

### 4. Проверка Skills

- **Skills** подхватываются Claude Code и доступны под namespace плагина (например `/agentstack:agentstack-8dna`, `/agentstack:agentstack-projects`, `/agentstack:agentstack-rules-engine`). Выполните `/help` чтобы увидеть список. Агент использует их по контексту задачи (8DNA, проекты, Rules Engine).

### 5. Типичные проблемы

| Симптом | Что проверить |
|--------|----------------|
| Агент не вызывает MCP | MCP добавлен через `claude mcp add`, указан верный URL и заголовок `X-API-Key`, Claude Code перезапущен при необходимости. |
| 401 / 403 при вызове | Ключ валидный, не истёк; для части операций нужна подписка (например, Professional для add_user). |
| "Tool not found" | Имя tool совпадает с документацией (например, `projects.create_project_anonymous`). Проверить список: `GET https://agentstack.tech/mcp/tools` (с заголовком `X-API-Key`). |
| Skills не видны | Плагин загружен (`--plugin-dir` или установлен из marketplace). Проверить `/help` и namespace (например `agentstack:agentstack-8dna`). |

---

## Возможности плагина

### Что входит в плагин

| Компонент | Назначение |
|-----------|------------|
| **Манифест** (`.claude-plugin/plugin.json`) | Имя, описание, ключевые слова для Claude Code и marketplace. |
| **Skills** (3 штуки) | Обучают агента, *когда* и *как* использовать AgentStack: 8DNA, проекты, Rules Engine. |
| **Документация** | README, MCP_QUICKSTART, этот файл. |

### Возможности через MCP (после настройки MCP)

Плагин сам по себе не выполняет запросы к бэкенду — это делает **MCP-сервер AgentStack**. После добавления MCP в Claude Code агент получает доступ к инструментам, например:

- **Проекты:** создание (в т.ч. анонимное), список, детали, обновление, удаление, статистика, пользователи, настройки, активность, API-ключи, привязка анонимного проекта к пользователю.
- **Логика и правила:** создание/обновление/удаление правил, список, выполнение, процессоры, команды.
- **Баффы:** создание, применение, продление, откат, отмена, список активных, эффективные лимиты, временные и постоянные эффекты.
- **Платежи:** создание, статус, возврат, список транзакций, баланс.
- **Auth:** быстрый вход, создание пользователя, назначение роли, профиль.
- **Планировщик:** создание/отмена/получение/список задач и др.
- **Аналитика:** использование, метрики.
- **API-ключи:** создание, список, отзыв и др.
- **Webhooks, уведомления, кошельки** — по мере реализации на бэкенде и в MCP.

Точный список инструментов и их параметры: **MCP_SERVER_CAPABILITIES** в репозитории AgentStack или `GET https://agentstack.tech/mcp/tools` (с `X-API-Key`).

### Возможности Skills

- **agentstack-8dna:** проектирование и запросы к данным с иерархией (`parent_uuid`) и эволюцией (`generation`), работа со структурой `data`/`config`/`protected` и genetic coding.
- **agentstack-projects:** создание и управление проектами и API-ключами через MCP, анонимные проекты, привязка к пользователю.
- **agentstack-rules-engine:** настройка серверной логики без кода (when/do), использование Logic Engine и правил через MCP, связка с баффами и командами.

### Итог

- **Проверка:** установить плагин → настроить MCP с API key → в чате попросить создать/показать проекты и проверить вызовы MCP; при необходимости проверить применение Skills по поведению.
- **Возможности:** доступ к 60+ MCP-инструментам AgentStack (проекты, логика, баффы, платежи, auth, планировщик, аналитика и др.), плюс три Skills для согласованной работы с 8DNA, проектами и Rules Engine.
