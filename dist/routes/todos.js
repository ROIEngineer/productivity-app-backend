"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createTodosRouter;
const express_1 = require("express");
const todosController_1 = require("../controllers/todosController");
function createTodosRouter(db) {
    const router = (0, express_1.Router)();
    router.get("/", (0, todosController_1.getTodos)(db));
    router.post("/", (0, todosController_1.createTodo)(db));
    router.put("/:id", (0, todosController_1.updateTodo)(db));
    router.delete("/:id", (0, todosController_1.deleteTodo)(db));
    return router;
}
