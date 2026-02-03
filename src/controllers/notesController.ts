import { Request, Response } from "express";
import { Database, Note } from "../types";

/**
 * Factory: receives DB once, returns handlers
 */
export function getNotes(db: Database) {
  return (req: Request, res: Response) => {
    try {
      const notes: Note[] = db
        .prepare("SELECT * FROM notes ORDER BY updated_at DESC")
        .all();

      res.json(notes);
    } catch {
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  };
}

export function createNote(db: Database) {
  return (req: Request, res: Response) => {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const timestamp = new Date().toISOString();

    try {
      const result = db
        .prepare(
          "INSERT INTO notes (content, updated_at) VALUES (?, ?)"
        )
        .run(content, timestamp);

      res.status(201).json({
        id: Number(result.lastInsertRowid),
        content,
        updated_at: timestamp,
      });
    } catch {
      res.status(500).json({ error: "Failed to create note" });
    }
  };
}

export function updateNote(db: Database) {
  return (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const timestamp = new Date().toISOString();

    try {
      const result = db
        .prepare(
          "UPDATE notes SET content = ?, updated_at = ? WHERE id = ?"
        )
        .run(content, timestamp, id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.json({
        id: Number(id),
        content,
        updated_at: timestamp,
      });
    } catch {
      res.status(500).json({ error: "Failed to update note" });
    }
  };
}

export function deleteNote(db: Database) {
  return (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = db
        .prepare("DELETE FROM notes WHERE id = ?")
        .run(id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Note not found" });
      }

      res.status(204).end();
    } catch {
      res.status(500).json({ error: "Failed to delete note" });
    }
  };
}
