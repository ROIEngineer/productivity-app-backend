import { Request, Response } from "express";
import { Database, Todo } from "../types";

export function getTodos(db: Database) {
  return (req: Request, res: Response) => {
    try {
      const todos: Todo[] = db
        .prepare("SELECT * FROM todos")
        .all();

      res.json(todos);
    } catch {
      res.status(500).json({ error: "Failed to fetch todos" });
    }
  };
}

export function createTodo(db: Database) {
  return (req: Request, res: Response) => {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    try {
      const result = db
        .prepare(
          "INSERT INTO todos (title, completed) VALUES (?, ?)"
        )
        .run(title, 0);

      const newTodo: Todo = {
        id: Number(result.lastInsertRowid),
        title,
        completed: 0,
      };

      res.status(201).json(newTodo);
    } catch {
      res.status(500).json({ error: "Failed to create todo" });
    }
  };
}

export function updateTodo(db: Database) {
  return (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, completed } = req.body;

    try {
      const existing = db
        .prepare("SELECT * FROM todos WHERE id = ?")
        .get(id) as Todo | undefined;

      if (!existing) {
        return res.status(404).json({ error: "Todo not found" });
      }

      const updatedTitle = title ?? existing.title;
      const updatedCompleted = completed ?? existing.completed;

      db.prepare(
        "UPDATE todos SET title = ?, completed = ? WHERE id = ?"
      ).run(updatedTitle, updatedCompleted, id);

      res.json({
        id: Number(id),
        title: updatedTitle,
        completed: updatedCompleted,
      });
    } catch {
      res.status(500).json({ error: "Failed to update todo" });
    }
  };
}

export function deleteTodo(db: Database) {
  return (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = db
        .prepare("DELETE FROM todos WHERE id = ?")
        .run(id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }

      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete todo" });
    }
  };
}
