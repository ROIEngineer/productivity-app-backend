"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
const db_1 = require("../db");
async function getNotes(req, res) {
    try {
        const { rows } = await db_1.pool.query("SELECT * FROM notes ORDER BY updated_at DESC");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch notes" });
    }
}
async function createNote(req, res) {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    try {
        const { rows } = await db_1.pool.query(`
      INSERT INTO notes (content)
      VALUES ($1)
      RETURNING *
      `, [content]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create note" });
    }
}
async function updateNote(req, res) {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }
    try {
        const { rows } = await db_1.pool.query(`
      UPDATE notes
      SET content = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
      `, [content, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update note" });
    }
}
async function deleteNote(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await db_1.pool.query("DELETE FROM notes WHERE id = $1", [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: "Note not found" });
        }
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete note" });
    }
}
