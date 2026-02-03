"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createNotesRouter;
const express_1 = require("express");
const notesController_1 = require("../controllers/notesController");
function createNotesRouter(db) {
    const router = (0, express_1.Router)();
    router.get("/", (0, notesController_1.getNotes)(db));
    router.post("/", (0, notesController_1.createNote)(db));
    router.put("/:id", (0, notesController_1.updateNote)(db));
    router.delete("/:id", (0, notesController_1.deleteNote)(db));
    return router;
}
