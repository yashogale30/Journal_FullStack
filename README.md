# Journal App in Three Ways

The same simple journal app built three times, to learn how each stack works. All three share one PostgreSQL database and expose the same five endpoints.

## The three versions

1. **reactnode**: React frontend (Vite) with a plain Node backend using the built in `http` module.
2. **express**: the same backend rewritten with Express. It uses the React frontend from the `reactnode` folder unchanged.
3. **next**: a Next.js app (App Router) where the pages and the API live in one project.

## Folders

* `reactnode/frontend` : React app (Vite)
* `reactnode/backend` : raw Node server
* `express` : Express backend with `routes/` and `services/`
* `next` : Next.js app

## Tech used

React, Node.js, Express, Next.js, PostgreSQL, the `pg` package with raw SQL.

## Database setup

Create a database (for example `journal_app`) and run:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL
);

CREATE TABLE journal_entries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (username) VALUES ('testuser');
```

## Environment variables

Each backend needs a connection string. Never commit these files.

* In `reactnode/backend` and `express`, create a `.env` file:

```
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/journal_app
```

* In `next`, create a `.env.local` file with the same line.

## API

The same five endpoints exist in every version.

1. `POST /users` creates a user. Body: `{ "username": "testuser" }`
2. `GET /journal/:username` lists a user's entries.
3. `POST /journal/:username` creates an entry. Body: `{ "title": "...", "content": "..." }`
4. `PUT /journal/:id` updates an entry.
5. `DELETE /journal/:id` deletes an entry.

In the Next version the paths start with `/api`, and update and delete use `/api/journal/entry/:id`.

## How to run

Only run one backend at a time, because they all use port 3000.

### 1. React + Node

Backend:

```
cd reactnode/backend
npm install
node server.js
```

Frontend, in a second terminal:

```
cd reactnode/frontend
npm install
npm run dev
```

Open http://localhost:5173

### 2. React + Express

Stop the raw Node server first. Then:

```
cd express
npm install
npx nodemon server.js
```

Run the same frontend from `reactnode/frontend` as above and open http://localhost:5173

### 3. Next.js

Stop any other server on port 3000. Then:

```
cd next
npm install
npm run dev
```

Open http://localhost:3000/journal/testuser

## What I learned

1. **Raw Node**: routing, body parsing and CORS all have to be written by hand, which shows what Express does for you.
2. **Express**: routers, middleware, a services layer and error handling replace most of that code.
3. **Next.js**: server components query the database directly, route handlers replace the API server, and `router.refresh()` replaces manual refetching. No CORS setup is needed because the page and API share one origin.

## Notes

This is a learning project. There is no authentication, and usernames are used as simple identifiers.