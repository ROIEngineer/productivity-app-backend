import { Router } from "express";
import { Database } from "better-sqlite3";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
} from "../controllers/todosController";

export default function createTodosRouter(db: Database) {
  const router = Router();

  router.get("/", getTodos(db));
  router.post("/", createTodo(db));
  router.put("/:id", updateTodo(db));
  router.delete("/:id", deleteTodo(db));

  return router;
}
