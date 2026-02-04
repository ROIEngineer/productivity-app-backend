import { Request, Response } from "express";
import { pool } from "../db";
import { Note, Database } from "../types";

export async function getNotes(req: Request, res: Response) {
  try {
    const { rows } = await pool.query<Note>(
      "SELECT * FROM notes ORDER BY updated_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notes" });
  }
}

export async function createNote(req: Request, res: Response) {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const { rows } = await pool.query<Note>(
      `
      INSERT INTO notes (content)
      VALUES ($1)
      RETURNING *
      `,
      [content]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create note" });
  }
}

export async function updateNote(req: Request, res: Response) {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required" });
  }

  try {
    const { rows } = await pool.query<Note>(
      `
      UPDATE notes
      SET content = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `,
      [content, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update note" });
  }
}

export async function deleteNote(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const { rowCount } = await pool.query(
      "DELETE FROM notes WHERE id = $1",
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete note" });
  }
}
