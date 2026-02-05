import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes";
import todosRouter from "./routes/todos";
import healthRouter from "./routes/health";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',          
  'http://localhost:3000',           
  'http://localhost:5174',           
  'https://https://productivity-app-frontend-eta.vercel.app/',    
  /https:\/\/.*\.vercel\.app$/       
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list or matches pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/health", healthRouter);
app.use("/notes", notesRouter);
app.use("/todos", todosRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});