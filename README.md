# TinkyWinky

NestJS project to parse and store FPS game match logs.

## Getting Started

### 1. Start the containers

```bash
docker compose up -d
```

### 2. Run Prisma migrations

```bash
npx prisma migrate deploy
```

The API will be available at `http://localhost:3000`.

---

### API Endpoints

- `POST /matches/logs` - Upload and parse a log file
- `GET /matches` - List all matches
- `GET /matches/:id/ranking` - Get ranking for a match
- `GET /players/ranking` - Get global players ranking

---

### Database Access (PostgreSQL)

You can connect to the DB with the following:

- Host: `localhost`
- Port: `5433`
- User: `postgres`
- Password: `postgres`
- Database: `tinkywinky_db`

## 💬 Message to Reviewers

- The choice for a preprocessing step during match load to compute and persist data was made to simulate a scenario with performance and scalability in mind. Depending on the context, this may not be the best initial approach, as it introduces complexity early on and might make it harder to adapt to changing requirements.
- Not all bonus features were completed due to time constraints.
- Only the main tests were written for now to cover the core behavior of the system.
- The code can still be refactored and improved.
  - One known limitation is that importing the same log file multiple times in sequence will cause conflicts, as thereis no logic yet to reprocess and recalculate player stats properly, without duplication by summing again the same frags and deaths.

If you have any questions, reach me!
