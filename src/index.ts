import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes";
import todosRouter from "./routes/todos";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/notes", notesRouter);
app.use("/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
