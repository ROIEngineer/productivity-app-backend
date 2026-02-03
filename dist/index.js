"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const todos_1 = __importDefault(require("./routes/todos"));
const notes_1 = __importDefault(require("./routes/notes"));
const PORT = process.env.PORT || 3000;
function startServer() {
    const db = new better_sqlite3_1.default(process.env.DB_PATH ?? "./todos.db");
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
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use("/todos", (0, todos_1.default)(db));
    app.use("/notes", (0, notes_1.default)(db));
    process.on("SIGINT", () => {
        db.close();
        process.exit(0);
    });
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
startServer();
