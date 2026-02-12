<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Как запустить бэкенд (LMS)

**Чтобы сайт работал, бэкенд должен быть запущен.**

**Нужен PostgreSQL.** Бэкенд подключается к БД по `DATABASE_URL` из `.env` (по умолчанию `localhost:5432`, база `LMS`, пользователь `postgres`). Запусти службу PostgreSQL до старта бэкенда (например: служба «postgresql-x64-…» в Windows или `pg_ctl start` / Docker).

1. Открой **терминал** (в Cursor: Terminal → New Terminal или в папке `backend` правый клик → «Open in Integrated Terminal»).
2. Перейди в папку бэкенда: `cd backend` (если ты не в корне проекта — укажи полный путь к папке `backend`).
3. Запусти: `npm run start:dev` (или `pnpm run start:dev`, если используешь pnpm).
4. Дождись сообщения вроде **«Nest application successfully started»** или **«Listening on port 3001»**.
5. Оставь это окно терминала открытым и обнови страницу в браузере (http://localhost:3000).

Либо дважды кликни по файлу **`start-backend.bat`** в папке `backend` — откроется окно с запущенным сервером.

### Бэкенд «не ловит» запросы (ERR_CONNECTION_REFUSED на :3001)

1. **Запущен ли процесс бэкенда?** В отдельном терминале должен быть запущен `pnpm run start:dev` из папки `backend`, и окно не должно быть закрыто.
2. **Есть ли строка в консоли?** Должно появиться: **`>>> Backend запущен: http://localhost:3001`**. Если её нет — процесс упал до старта (смотри текст ошибки выше в терминале).
3. **Проверка в браузере:** открой **http://localhost:3001/health** — должна открыться страница с `{"ok":true,"message":"Backend works","port":3001}`. Если «Не удается получить доступ» — бэкенд не слушает порт 3001 (не запущен или упал).
4. **PostgreSQL:** если при старте в консоли есть ошибка про БД — запусти службу PostgreSQL и проверь `DATABASE_URL` в `.env`.
5. **Порт занят?** Если другой процесс занял 3001, смени порт в `backend/.env`: `PORT=3002` (и на фронте в `config/api.js` или `.env` укажи тот же порт).

### Режим Netlify dev (один бэкенд-терминал, фронт ходит на :8888)

Если хочешь запускать бэкенд одной командой и чтобы фронт к нему подключался:

1. **В папке `backend`:** `pnpm run netlify:dev` — поднимется Nest на 3001 и Netlify dev на **http://localhost:8888** (запросы на 8888 проксируются на Nest).
2. **В папке `frontend`:** создай файл **`.env.development.local`** с одной строкой:
   ```env
   REACT_APP_API_URL=http://localhost:8888
   ```
3. Запусти фронт: `pnpm start` (из папки `frontend`).
4. Фронт будет ходить на бэкенд по адресу 8888.

Без `.env.development.local` фронт в dev по умолчанию использует proxy на 3001 (режим «backend start:dev + frontend start»).

### Миграции базы данных (Drizzle)

**Для Railway (рекомендуется):**
Миграции запускаются автоматически при деплое, если в настройках Railway используется команда `start:prod:with-migrate` вместо `start:prod`.

**Для локального запуска миграций:**
Если нужно запустить миграции локально против Railway Postgres:

1. Получите **публичный URL** из Railway:
   - Откройте проект в Railway
   - Перейдите в Postgres сервис → вкладка **"Variables"** или **"Connect"**
   - Найдите `DATABASE_URL` с публичным хостом (не `postgres.railway.internal`, а что-то вроде `containers-us-west-xxx.railway.app`)

2. Запустите миграции с публичным URL:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway"; pnpm run db:migrate
   
   # Windows CMD
   set DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway && pnpm run db:migrate
   
   # Linux/Mac
   DATABASE_URL="postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway" pnpm run db:migrate
   ```

**Примечание:** Внутренний URL (`postgres.railway.internal`) работает только внутри сети Railway и недоступен с локальной машины.

---

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
