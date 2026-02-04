import { Request, Response } from "express";
import { pool } from "../db";
import { Todo } from "../types";

export async function getTodos(req: Request, res: Response) {
  try {
    const { rows } = await pool.query<Todo>(
      "SELECT * FROM todos ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}

export async function createTodo(req: Request, res: Response) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query<Todo>(
      `
      INSERT INTO todos (title)
      VALUES ($1)
      RETURNING *
      `,
      [title]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}

export async function updateTodo(req: Request, res: Response) {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const { rows } = await pool.query<Todo>(
      `
      UPDATE todos
      SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
      WHERE id = $3
      RETURNING *
      `,
      [title, completed, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
}

export async function deleteTodo(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM todos WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
}
