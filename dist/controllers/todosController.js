"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTodos = getTodos;
exports.createTodo = createTodo;
exports.updateTodo = updateTodo;
exports.deleteTodo = deleteTodo;
const db_1 = require("../db");
async function getTodos(req, res) {
    try {
        const { rows } = await db_1.pool.query("SELECT * FROM todos ORDER BY id ASC");
        res.json(rows);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch todos" });
    }
}
async function createTodo(req, res) {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }
    try {
        const { rows } = await db_1.pool.query(`
      INSERT INTO todos (title)
      VALUES ($1)
      RETURNING *
      `, [title]);
        res.status(201).json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create todo" });
    }
}
async function updateTodo(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;
    try {
        const { rows } = await db_1.pool.query(`
      UPDATE todos
      SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
      WHERE id = $3
      RETURNING *
      `, [title, completed, id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.json(rows[0]);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to update todo" });
    }
}
async function deleteTodo(req, res) {
    const { id } = req.params;
    try {
        const { rowCount } = await db_1.pool.query("DELETE FROM todos WHERE id = $1", [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: "Todo not found" });
        }
        res.status(204).end();
    }
    catch (err) {
        res.status(500).json({ error: "Failed to delete todo" });
    }
}
