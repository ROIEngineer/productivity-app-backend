# Productivity Suite - Backend

A RESTful API built with Express.js and TypeScript, providing endpoints for todos and notes with PostgreSQL database integration.

## Overview

This is the backend API for the Productivity Suite application. Built with Node.js, Express, and TypeScript, it provides a robust REST API with full CRUD operations for todos and notes. The architecture follows the Model-View-Controller (MVC) pattern with clear separation of concerns: routes define endpoints, controllers handle business logic, and the database layer manages data persistence. The API demonstrates professional backend development practices including proper error handling, type safety, CORS configuration, and database connection pooling.

## Live Demo

**API Base URL:** [Your deployed backend URL]  
**Health Check:** `/health`  
**GitHub Repository:** [Your repository URL]

## Features

### API Endpoints
- **Todos CRUD** - Create, read, update, delete todos
- **Notes CRUD** - Create, read, update, delete notes
- **Health Check** - Monitor backend and database status
- **RESTful Design** - Standard HTTP methods and status codes

### Database
- **PostgreSQL Integration** - Reliable relational database
- **Connection Pooling** - Efficient database resource management
- **Parameterized Queries** - SQL injection prevention
- **Automatic Timestamps** - Track note creation/updates
- **Indexed Queries** - Optimized database performance

### Security & Configuration
- **CORS Support** - Configurable cross-origin requests
- **Multiple Origin Support** - Development and production origins
- **Environment Variables** - Secure credential management
- **SSL/TLS Support** - Encrypted database connections in production
- **Error Handling** - Comprehensive error responses

### Code Quality
- **TypeScript** - Type safety throughout the stack
- **MVC Architecture** - Organized, maintainable code structure
- **Interface Definitions** - Shared types between layers
- **Async/Await** - Modern asynchronous patterns
- **HTTP Status Codes** - Proper REST API responses

## Architecture

```
┌─────────────────────────────────┐
│      HTTP Request (Client)      │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│      Express Middleware         │
│      - CORS                     │
│      - JSON Parser              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│         Routes Layer            │
│      - /todos                   │
│      - /notes                   │
│      - /health                  │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│      Controllers Layer          │
│      - todosController          │
│      - notesController          │
│      - healthController         │
│      (Business Logic)           │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│      Database Layer (pg)        │
│      - Connection Pool          │
│      - SQL Queries              │
└────────────┬────────────────────┘
             │
             ▼
┌─────────────────────────────────┐
│      PostgreSQL Database        │
│      - todos table              │
│      - notes table              │
└─────────────────────────────────┘
```

### MVC Pattern

**Routes** → Define endpoints and HTTP methods
```typescript
router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);
```

**Controllers** → Handle request/response logic
```typescript
export async function getTodos(req: Request, res: Response) {
  const { rows } = await pool.query("SELECT * FROM todos");
  res.json(rows);
}
```

**Database** → Manage data persistence
```typescript
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
```

### Request Flow

1. **Client Request** - Frontend sends HTTP request
2. **CORS Check** - Validates origin is allowed
3. **Route Matching** - Express routes to correct handler
4. **Controller Logic** - Validates and processes request
5. **Database Query** - Executes SQL with connection pool
6. **Response** - Returns JSON or appropriate status code
7. **Error Handling** - Catches and returns error responses

### Database Schema

```sql
-- Todos table
CREATE TABLE todos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE
);

-- Notes table
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_todos_completed ON todos(completed);
CREATE INDEX idx_notes_updated ON notes(updated_at DESC);
```

## Tech Stack

### Core Technologies
- **Node.js** - JavaScript runtime (v16+)
- **Express.js 4** - Web application framework
- **TypeScript 5** - Type-safe JavaScript superset
- **PostgreSQL** - Relational database system
- **pg** - PostgreSQL client for Node.js

### Development Tools
- **dotenv** - Environment variable management
- **cors** - Cross-Origin Resource Sharing middleware
- **TypeScript Compiler** - Transpiles TS to JS

### Production Tools
- **Render** - Hosting platform (recommended)
- **Heroku** - Alternative hosting
- **Railway** - Alternative hosting

## Setup

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd productivity-app/productivity-app-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment variables**
   
   Create a `.env` file in the backend root:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://username:password@localhost:5432/productivity
   ```

4. **Set up PostgreSQL database**

   **Create database:**
   ```bash
   createdb productivity
   ```

   **Connect to database:**
   ```bash
   psql productivity
   ```

   **Run schema:**
   ```sql
   -- Create todos table
   CREATE TABLE todos (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     completed BOOLEAN DEFAULT FALSE
   );

   -- Create notes table
   CREATE TABLE notes (
     id SERIAL PRIMARY KEY,
     content TEXT NOT NULL,
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create indexes for performance
   CREATE INDEX idx_todos_completed ON todos(completed);
   CREATE INDEX idx_notes_updated ON notes(updated_at DESC);
   ```

   **Verify tables:**
   ```sql
   \dt
   ```

5. **Build TypeScript**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   # Production mode
   npm start

   # Development mode with auto-reload
   npm run dev
   ```

   Server will start on `http://localhost:3000`

### Testing the API

**Health check:**
```bash
curl http://localhost:3000/health
```

**Get all todos:**
```bash
curl http://localhost:3000/todos
```

**Create a todo:**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo"}'
```

## Deployment

### Render (Recommended)

#### 1. Create PostgreSQL Database

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **PostgreSQL**
3. Configure:
   - Name: `productivity-db`
   - Database: `productivity`
   - User: (auto-generated)
   - Region: Choose closest to users
   - Plan: Free or Starter
4. Click **Create Database**
5. Copy **Internal Database URL**

#### 2. Run Database Schema

1. In Render dashboard, go to your database
2. Click **Connect** → **External Connection**
3. Use provided command to connect with psql
4. Run the SQL schema commands from setup section

#### 3. Create Web Service

1. Click **New +** → **Web Service**
2. Connect your repository
3. Configure:
   - Name: `productivity-backend`
   - Root Directory: `productivity-app-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Plan: Free or Starter

#### 4. Add Environment Variables

In web service settings, add:

| Key | Value | Notes |
|-----|-------|-------|
| `DATABASE_URL` | [Internal DB URL] | From database settings |
| `NODE_ENV` | `production` | Production mode |
| `PORT` | (auto-set by Render) | Render provides this |

#### 5. Deploy

- Render automatically deploys on setup
- Future Git pushes trigger auto-deploys
- View logs in Render dashboard

**Note:** Free tier services may spin down after 15 minutes of inactivity.

### Heroku

```bash
# Login to Heroku
heroku login

# Create new app
heroku create productivity-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run database migrations
heroku pg:psql < schema.sql

# View logs
heroku logs --tail
```

### Railway

1. Create new project on Railway
2. Add PostgreSQL database from marketplace
3. Connect GitHub repository
4. Railway auto-detects Node.js
5. Add environment variables
6. Deploy automatically triggers

### DigitalOcean App Platform

1. Create new app
2. Connect repository
3. Add managed PostgreSQL database
4. Configure build and run commands
5. Set environment variables
6. Deploy

## API Reference

### Base URL

```
http://localhost:3000
```

### Endpoints

#### Health Check

**GET /health**

Check backend and database connectivity.

**Response:** `200 OK`
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-02-14T10:30:00.000Z"
}
```

**Error Response:** `500 Internal Server Error`
```json
{
  "status": "error",
  "database": "disconnected",
  "timestamp": "2025-02-14T10:30:00.000Z"
}
```

---

#### Get All Todos

**GET /todos**

Retrieve all todos, ordered by ID.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Complete project documentation",
    "completed": false
  },
  {
    "id": 2,
    "title": "Review pull requests",
    "completed": true
  }
]
```

**Error Response:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch todos"
}
```

---

#### Create Todo

**POST /todos**

Create a new todo.

**Request Body:**
```json
{
  "title": "New task"
}
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "title": "New task",
  "completed": false
}
```

**Error Responses:**

*Missing title:* `400 Bad Request`
```json
{
  "error": "Title is required"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to create todo"
}
```

---

#### Update Todo

**PUT /todos/:id**

Update an existing todo. Can update title, completed status, or both.

**Request Body:**
```json
{
  "title": "Updated title",
  "completed": true
}
```

**Note:** Both fields are optional. Only provided fields will be updated.

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated title",
  "completed": true
}
```

**Error Responses:**

*Todo not found:* `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to update todo"
}
```

---

#### Delete Todo

**DELETE /todos/:id**

Delete a todo.

**Response:** `204 No Content`

(Empty response body)

**Error Responses:**

*Todo not found:* `404 Not Found`
```json
{
  "error": "Todo not found"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to delete todo"
}
```

---

#### Get All Notes

**GET /notes**

Retrieve all notes, ordered by most recent first.

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "content": "Meeting notes from standup",
    "updated_at": "2025-02-14T10:30:00.000Z"
  },
  {
    "id": 2,
    "content": "Ideas for next sprint",
    "updated_at": "2025-02-14T09:15:00.000Z"
  }
]
```

**Error Response:** `500 Internal Server Error`
```json
{
  "error": "Failed to fetch notes"
}
```

---

#### Create Note

**POST /notes**

Create a new note.

**Request Body:**
```json
{
  "content": "New note content"
}
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "content": "New note content",
  "updated_at": "2025-02-14T11:00:00.000Z"
}
```

**Error Responses:**

*Missing content:* `400 Bad Request`
```json
{
  "error": "Content is required"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to create note"
}
```

---

#### Update Note

**PUT /notes/:id**

Update an existing note's content. Automatically updates the `updated_at` timestamp.

**Request Body:**
```json
{
  "content": "Updated note content"
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "content": "Updated note content",
  "updated_at": "2025-02-14T11:05:00.000Z"
}
```

**Error Responses:**

*Missing content:* `400 Bad Request`
```json
{
  "error": "Content is required"
}
```

*Note not found:* `404 Not Found`
```json
{
  "error": "Note not found"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to update note"
}
```

---

#### Delete Note

**DELETE /notes/:id**

Delete a note.

**Response:** `204 No Content`

(Empty response body)

**Error Responses:**

*Note not found:* `404 Not Found`
```json
{
  "error": "Note not found"
}
```

*Server error:* `500 Internal Server Error`
```json
{
  "error": "Failed to delete note"
}
```

## Project Structure

```
productivity-app-backend/
├── src/
│   ├── controllers/
│   │   ├── todosController.ts   # Todo business logic
│   │   ├── notesController.ts   # Notes business logic
│   │   └── healthController.ts  # Health check logic
│   │
│   ├── routes/
│   │   ├── todos.ts             # Todo endpoints
│   │   ├── notes.ts             # Notes endpoints
│   │   └── health.ts            # Health endpoint
│   │
│   ├── db.ts                    # Database connection pool
│   ├── index.ts                 # Express app entry point
│   └── types.ts                 # TypeScript interfaces
│
├── dist/                        # Compiled JavaScript (build output)
│   ├── controllers/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   └── types.js
│
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── .env                         # Environment variables (not committed)
└── .gitignore                   # Git ignore rules
```

### File Descriptions

**index.ts:**
- Express app initialization
- Middleware configuration (CORS, JSON parser)
- Route mounting
- Server startup

**db.ts:**
- PostgreSQL connection pool
- SSL configuration for production
- Exports pool for controllers

**routes/:**
- Define API endpoints
- Map HTTP methods to controller functions
- RESTful route structure

**controllers/:**
- Handle request/response logic
- Execute database queries
- Return JSON responses or errors
- Input validation

**types.ts:**
- TypeScript interface definitions
- Shared types across application
- Database row types

## Code Examples

### Controller Pattern

```typescript
// todosController.ts
import { Request, Response } from "express";
import { pool } from "../db";
import { Todo } from "../types";

export async function getTodos(req: Request, res: Response) {
  try {
    const { rows } = await pool.query<Todo>(
      "SELECT * FROM todos ORDER BY id ASC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
}

export async function createTodo(req: Request, res: Response) {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const { rows } = await pool.query<Todo>(
      "INSERT INTO todos (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create todo" });
  }
}
```

### Route Pattern

```typescript
// routes/todos.ts
import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todosController";

const router = Router();

router.get("/", getTodos);
router.post("/", createTodo);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTodo);

export default router;
```

### Database Connection

```typescript
// db.ts
import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});
```

### CORS Configuration

```typescript
// index.ts
const allowedOrigins = [
  'http://localhost:5173',          // Vite dev
  'http://localhost:3000',          // Alt local
  'https://yourapp.vercel.app',    // Production
  /https:\/\/.*\.vercel\.app$/     // Preview deploys
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
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
```

## Environment Variables

### Required Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `3000` | No (default: 3000) |
| `NODE_ENV` | Environment mode | `production` | Yes |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` | Yes |

### Variable Details

**PORT:**
- Default: `3000`
- Render sets this automatically
- Used by Express to bind server

**NODE_ENV:**
- Values: `development` or `production`
- Affects database SSL settings
- Changes error verbosity

**DATABASE_URL:**
- Format: `postgresql://username:password@host:port/database`
- Use internal URL on Render for security
- SSL automatically enabled in production

## Database Management

### Connecting to Database

**Local:**
```bash
psql postgresql://username:password@localhost:5432/productivity
```

**Render:**
- Use external connection URL from dashboard
- Or use Render's built-in psql shell

### Common SQL Queries

**View all todos:**
```sql
SELECT * FROM todos ORDER BY id;
```

**View all notes:**
```sql
SELECT * FROM notes ORDER BY updated_at DESC;
```

**Count todos:**
```sql
SELECT COUNT(*) FROM todos;
```

**Find completed todos:**
```sql
SELECT * FROM todos WHERE completed = true;
```

**Recent notes:**
```sql
SELECT * FROM notes 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;
```

**Delete old completed todos:**
```sql
DELETE FROM todos WHERE completed = true;
```

### Database Maintenance

**Backup:**
```bash
pg_dump -U username productivity > backup.sql
```

**Restore:**
```bash
psql -U username productivity < backup.sql
```

**Vacuum (optimization):**
```sql
VACUUM ANALYZE todos;
VACUUM ANALYZE notes;
```

## Error Handling

### HTTP Status Codes

- `200 OK` - Successful GET, PUT
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

### Error Response Pattern

```typescript
try {
  // Database operation
} catch (err) {
  res.status(500).json({ 
    error: "User-friendly error message" 
  });
}
```

### Validation Errors

```typescript
if (!title) {
  return res.status(400).json({ 
    error: "Title is required" 
  });
}
```

## Security Best Practices

### Implemented Measures

1. **Parameterized Queries** - Prevents SQL injection
2. **CORS Configuration** - Restricts allowed origins
3. **Environment Variables** - Secrets not in code
4. **SSL/TLS** - Encrypted database connections
5. **Error Handling** - No sensitive info in responses

### SQL Injection Prevention

**Bad (vulnerable):**
```typescript
// DON'T DO THIS
const query = `INSERT INTO todos (title) VALUES ('${title}')`;
```

**Good (safe):**
```typescript
// DO THIS
const query = "INSERT INTO todos (title) VALUES ($1)";
await pool.query(query, [title]);
```

### Recommended Additions

- [ ] Add rate limiting
- [ ] Implement authentication (JWT)
- [ ] Add request validation library (Joi, Zod)
- [ ] Implement logging
- [ ] Add Helmet.js for security headers
- [ ] Use HTTPS redirect
- [ ] Add input sanitization
- [ ] Implement API versioning

## Performance Optimization

### Current Optimizations

1. **Connection Pooling** - Reuses database connections
2. **Database Indexes** - Fast lookups on common queries
3. **TypeScript** - Compile-time optimization
4. **Async/Await** - Non-blocking I/O

### Recommended Improvements

- [ ] Add Redis caching
- [ ] Implement pagination for large datasets
- [ ] Add database query optimization
- [ ] Compress responses with gzip
- [ ] Add connection timeout settings
- [ ] Implement query result caching
- [ ] Monitor slow queries
- [ ] Add database read replicas

## Troubleshooting

### Common Issues

**Issue:** "Database connection failed"

**Solutions:**
- Verify `DATABASE_URL` is correct
- Check PostgreSQL is running
- Ensure network allows connection
- Verify credentials
- Check SSL settings

---

**Issue:** "EADDRINUSE: address already in use"

**Solutions:**
- Port 3000 is already taken
- Kill process: `lsof -ti:3000 | xargs kill`
- Use different port in `.env`

---

**Issue:** "CORS error" in browser

**Solutions:**
- Add frontend origin to `allowedOrigins`
- Restart server after changing origins
- Check exact URL (http vs https)
- Verify no trailing slash

---

**Issue:** "Module not found" errors

**Solutions:**
- Run `npm install`
- Delete `node_modules` and reinstall
- Check imports use correct paths
- Rebuild TypeScript: `npm run build`

## Testing

### Manual API Testing

**Using curl:**
```bash
# Health check
curl http://localhost:3000/health

# Get todos
curl http://localhost:3000/todos

# Create todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Test todo"}'

# Update todo
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete todo
curl -X DELETE http://localhost:3000/todos/1
```

**Using Postman:**
1. Import collection
2. Set base URL variable
3. Test each endpoint
4. Verify responses

### Automated Testing

**Framework recommendation:** Jest + Supertest

```bash
npm install -D jest @types/jest supertest @types/supertest ts-jest
```

**Example test:**
```typescript
import request from 'supertest';
import app from './index';

describe('Todos API', () => {
  it('should get all todos', async () => {
    const response = await request(app).get('/todos');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should create a todo', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ title: 'Test todo' });
    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test todo');
  });
});
```

## Future Enhancements

- [ ] Add user authentication (JWT)
- [ ] Implement pagination
- [ ] Add search and filtering
- [ ] Create todo categories/tags
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Add request logging
- [ ] Create API versioning
- [ ] Add GraphQL endpoint
- [ ] Implement WebSocket for real-time updates
- [ ] Add background job processing
- [ ] Create admin dashboard endpoints
- [ ] Add data export functionality
- [ ] Implement soft deletes
- [ ] Add audit logging

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Follow existing code style
4. Add tests for new features
5. Update documentation
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

**Harold Durant**  
Email: [Your Email]  
GitHub: [@ROIEngineer](https://github.com/ROIEngineer)  
Portfolio: [Your Portfolio URL]

---

Built with ❤️ using Node.js, Express, TypeScript, and PostgreSQL
