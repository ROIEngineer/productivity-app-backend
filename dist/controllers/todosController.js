"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodos = getTodos;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
function getTodos(db) {
    return (req, res) => {
        try {
            const todos = db
                .prepare("SELECT * FROM todos")
                .all();
            res.json(todos);
        }
        catch {
            res.status(500).json({ error: "Failed to fetch todos" });
        }
    };
}
function createTodo(db) {
    return (req, res) => {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }
        try {
            const result = db
                .prepare("INSERT INTO todos (title, completed) VALUES (?, ?)")
                .run(title, 0);
            const newTodo = {
                id: Number(result.lastInsertRowid),
                title,
                completed: 0,
            };
            res.status(201).json(newTodo);
        }
        catch {
            res.status(500).json({ error: "Failed to create todo" });
        }
    };
}
function updateTodo(db) {
    return (req, res) => {
        const { id } = req.params;
        const { title, completed } = req.body;
        try {
            const existing = db
                .prepare("SELECT * FROM todos WHERE id = ?")
                .get(id);
            if (!existing) {
                return res.status(404).json({ error: "Todo not found" });
            }
            const updatedTitle = title ?? existing.title;
            const updatedCompleted = completed ?? existing.completed;
            db.prepare("UPDATE todos SET title = ?, completed = ? WHERE id = ?").run(updatedTitle, updatedCompleted, id);
            res.json({
                id: Number(id),
                title: updatedTitle,
                completed: updatedCompleted,
            });
        }
        catch {
            res.status(500).json({ error: "Failed to update todo" });
        }
    };
}
function deleteTodo(db) {
    return (req, res) => {
        const { id } = req.params;
        try {
            const result = db
                .prepare("DELETE FROM todos WHERE id = ?")
                .run(id);
            if (result.changes === 0) {
                return res.status(404).json({ error: "Todo not found" });
            }
            res.status(204).end();
        }
        catch {
            res.status(500).json({ error: "Failed to delete todo" });
        }
    };
}
