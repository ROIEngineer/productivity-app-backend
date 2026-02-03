"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotes = getNotes;
exports.createNote = createNote;
exports.updateNote = updateNote;
exports.deleteNote = deleteNote;
/**
 * Factory: receives DB once, returns handlers
 */
function getNotes(db) {
    return (req, res) => {
        try {
            const notes = db
                .prepare("SELECT * FROM notes ORDER BY updated_at DESC")
                .all();
            res.json(notes);
        }
        catch {
            res.status(500).json({ error: "Failed to fetch notes" });
        }
    };
}
function createNote(db) {
    return (req, res) => {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const timestamp = new Date().toISOString();
        try {
            const result = db
                .prepare("INSERT INTO notes (content, updated_at) VALUES (?, ?)")
                .run(content, timestamp);
            res.status(201).json({
                id: Number(result.lastInsertRowid),
                content,
                updated_at: timestamp,
            });
        }
        catch {
            res.status(500).json({ error: "Failed to create note" });
        }
    };
}
function updateNote(db) {
    return (req, res) => {
        const { id } = req.params;
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }
        const timestamp = new Date().toISOString();
        try {
            const result = db
                .prepare("UPDATE notes SET content = ?, updated_at = ? WHERE id = ?")
                .run(content, timestamp, id);
            if (result.changes === 0) {
                return res.status(404).json({ error: "Note not found" });
            }
            res.json({
                id: Number(id),
                content,
                updated_at: timestamp,
            });
        }
        catch {
            res.status(500).json({ error: "Failed to update note" });
        }
    };
}
function deleteNote(db) {
    return (req, res) => {
        const { id } = req.params;
        try {
            const result = db
                .prepare("DELETE FROM notes WHERE id = ?")
                .run(id);
            if (result.changes === 0) {
                return res.status(404).json({ error: "Note not found" });
            }
            res.status(204).end();
        }
        catch {
            res.status(500).json({ error: "Failed to delete note" });
        }
    };
}
