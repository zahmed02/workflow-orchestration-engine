# Smart Task Orchestration & Workflow Engine

A full‑stack, data‑structure‑driven workflow automation platform that orchestrates complex task dependencies with priority‑based scheduling, resource management, and undo/redo capabilities.  
Built with Java, Spring Boot, React, and PostgreSQL – deployed on Render, Vercel, and Neon.

## Overview

This project demonstrates how multiple classic data structures can be combined to solve real‑world workflow orchestration problems. At its core, it manages **tasks** (with priorities and dependencies), groups them into **workflows**, and executes them using a priority‑based scheduler (`MaxHeap`) that respects dependency order (`AdjacencyListGraph` with topological sort).

Additional features include **resource tracking** (CPU, memory, etc.), **undo history** (via a custom stack), and **template caching** (using an AVL tree). The system is exposed via a REST API and a sleek, dark‑themed React dashboard.

## Features

- **Task Management** – Create, read, update, delete, and filter tasks by status (PENDING, READY, RUNNING, COMPLETED, FAILED).  
- **Dependency Resolution** – Define task dependencies; the engine uses a directed acyclic graph (DAG) to determine the correct execution order via topological sort.  
- **Priority Scheduling** – Tasks are prioritised using a `MaxHeap`; the highest‑priority ready task executes first.  
- **Workflow Execution** – Run a workflow, watch tasks transition through states, and see real‑time logs.  
- **Resource Management** – Track total/available capacity for resources (e.g., CPU, memory) and automatically allocate/release during execution.  
- **Undo History** – Every task state is pushed onto a custom `UndoStack`; you can revert any task to its previous state.  
- **Template Cache** – Save workflows as templates in an AVL tree for quick reuse.  
- **Full‑Stack Dashboard** – Interactive React frontend with dark mode, summary cards, activity feeds, and execution logs.  
- **Persistent Storage** – PostgreSQL database (Neon) stores all entities; data survives restarts.

## Tech Stack

### Backend
- **Java 21** (LTS)  
- **Spring Boot 3.4.3** – REST API, JPA, dependency injection  
- **Spring Data JPA / Hibernate** – ORM with PostgreSQL  
- **PostgreSQL** – managed via Neon (cloud)  
- **Maven** – build tool  
- **Custom Data Structures** – `MaxHeap`, `AdjacencyListGraph`, `AvlTree`, `UndoStack`  
- **Algorithms** – Topological sorting, heap operations, tree rotations  

### Frontend
- **React 19** with functional components & hooks  
- **Vite** – blazing fast build tool  
- **Tailwind CSS** – dark‑first custom design system (FlowState theme)  
- **Axios** – HTTP client for API calls  
- **React Router DOM** – client‑side routing  

### Deployment & Infrastructure
- **Render** – backend (Spring Boot) hosting  
- **Vercel** – frontend (React) hosting  
- **Neon.tech** – cloud PostgreSQL (free tier)  
- **GitHub** – version control and CI/CD trigger  

## Data Structures & Algorithms

| Data Structure | Purpose | Usage |
|----------------|---------|-------|
| **MaxHeap** | Priority queue | Schedules tasks in descending priority order (highest priority first). |
| **AdjacencyListGraph** | Directed graph | Models task dependencies; topological sort computes a valid execution order. |
| **AvlTree** | Self‑balancing BST | Caches workflow templates by name – O(log n) insertion, lookup, deletion. |
| **UndoStack** | Stack (LIFO) | Stores task snapshots; pop to undo the most recent state. |
| **HashMap** | Resource manager | O(1) lookup of resource by name to update capacity. |

## Getting Started (Local Development)

### Prerequisites
- **Java 21** (JDK)  
- **Maven** (3.9+)  
- **Node.js** (18+) & npm  
- **Git**  
- A **Neon.tech** account (or any PostgreSQL instance) for persistent data.

### 1. Clone the Repository
```bash
git clone https://github.com/zahmed02/workflow-orchestration-engine.git
cd workflow-orchestration-engine
```

### 2. Backend Setup

- Create a `.env` file in the `backend/` folder with your Neon credentials:
  ```env
  DB_HOST=your-neon-host
  DB_PORT=5432
  DB_NAME=neondb
  DB_USERNAME=neondb_owner
  DB_PASSWORD=your-password
  ```

- Navigate to `backend/` and build:
  ```bash
  cd backend
  mvn clean install
  ```

- Run the Spring Boot application:
  ```bash
  mvn spring-boot:run
  ```
  The backend will start at `http://localhost:8080`.

- Verify with: `curl http://localhost:8080/health` → should return `OK`.

### 3. Frontend Setup

- Navigate to `frontend/`:
  ```bash
  cd ../frontend
  ```

- Install dependencies:
  ```bash
  npm install
  ```

- Create a `.env` file (optional, for local development) with:
  ```env
  VITE_API_URL=http://localhost:8080
  ```

- Start the development server:
  ```bash
  npm run dev
  ```
  The frontend will be available at `http://localhost:5173`.

- The frontend proxies `/api` requests to the backend automatically during development.

## API Endpoints (Main)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/tasks` | GET, POST | List all tasks / create a new task |
| `/api/tasks/{id}` | GET, PUT, DELETE | Retrieve, update, delete a specific task |
| `/api/tasks/{id}/undo` | POST | Undo the last change to a task |
| `/api/workflows` | GET, POST | List all workflows / create a new workflow |
| `/api/workflows/{id}` | GET, DELETE | Retrieve, delete a workflow |
| `/api/workflows/{id}/execute` | POST | Execute a workflow |
| `/api/workflows/templates` | GET, POST | List / save workflow templates |
| `/api/resources` | GET, POST | List all resources / add a new resource |
| `/api/logs/recent` | GET | Fetch recent execution logs |
| `/api/undo/history` | GET | Retrieve the undo stack contents |

## Testing

1. **Create a Task** – via frontend (Tasks page) or API.
2. **Create a Workflow** – select existing tasks; their dependencies will be respected.
3. **Execute the Workflow** – click the play button; tasks will run in priority order.
4. **Monitor** – see status changes in the task list and execution logs on the dashboard.

## Deployment

### Backend (Render)
- The repository contains a `Dockerfile` that builds the Spring Boot application.
- Render automatically deploys on every push to the `main` branch.
- Environment variables (DB_HOST, DB_USERNAME, etc.) are set in Render’s dashboard.

### Frontend (Vercel)
- Vercel is connected to the GitHub repository.
- The project root directory is set to `frontend/`.
- Environment variable `VITE_API_URL` points to the Render backend URL.

### Database (Neon)
- Neon provides a fully managed PostgreSQL database.
- The free tier includes 0.5 GB storage and auto‑scaling to zero when idle.

## Project Structure

```
.
├── backend/
│   ├── src/main/java/com/workflow/
│   │   ├── config/               (CORS, DataLoader)
│   │   ├── controller/           (REST controllers)
│   │   ├── ds/                   (Custom data structures)
│   │   ├── dto/                  (Data transfer objects)
│   │   ├── model/                (JPA entities)
│   │   ├── repository/           (Spring Data repositories)
│   │   └── service/              (Business logic, DS usage)
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── .env                  (local credentials, ignored)
│   ├── Dockerfile
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/           (Reusable UI components)
│   │   ├── pages/                (Dashboard, Tasks, Workflows, …)
│   │   ├── services/             (API client)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── .gitignore
├── README.md
└── render.yaml                  (Render blueprints)
```
