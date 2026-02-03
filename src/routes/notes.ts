import { Router } from "express";
import { Database } from "better-sqlite3";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote
} from "../controllers/notesController";

export default function createNotesRouter(db: Database) {
  const router = Router();

  router.get("/", getNotes(db));
  router.post("/", createNote(db));
  router.put("/:id", updateNote(db));
  router.delete("/:id", deleteNote(db));

  return router;
}
