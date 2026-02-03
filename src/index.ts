import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import createTodosRouter from "./routes/todos";
import createNotesRouter from "./routes/notes";

const PORT = process.env.PORT || 3000;

function startServer() {
  const db = new Database(process.env.DB_PATH ?? "./todos.db");

  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/todos", createTodosRouter(db));
  app.use("/notes", createNotesRouter(db));

  process.on("SIGINT", () => {
    db.close();
    process.exit(0);
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
