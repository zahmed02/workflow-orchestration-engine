# Workflow Orchestration Engine

A production‑ready, full‑stack application that orchestrates complex task workflows using custom data structures.  
Built with Java Spring Boot, React, and PostgreSQL, and deployed on Render, Vercel, and Neon.

## 1. Description and Overview

FlowState is a **smart task orchestration and workflow engine** designed to manage, schedule, and execute interdependent tasks with priority‑based scheduling. The system allows users to define tasks with dependencies, group them into workflows, and execute them in a topologically sorted order, all while respecting resource constraints and providing undo capabilities.

The project demonstrates the practical application of fundamental data structures (heaps, graphs, trees, stacks) within a modern web architecture. It is built as a full‑stack application with a clean separation between the backend API, a persistent database, and a responsive frontend dashboard.

The backend is implemented in **Java 21** using **Spring Boot 3**, with **JPA/Hibernate** for database interaction and **PostgreSQL** for persistent storage. The frontend is developed with **React 19** and **Vite**, styled with **Tailwind CSS** and Google Material Symbols for a dark‑theme, professional UI.

## 2. Tech Stack

| Component            | Technology / Library                         | Version / Notes                    |
|----------------------|-----------------------------------------------|-------------------------------------|
| **Backend Language** | Java                                           | 21 (LTS)                           |
| **Backend Framework**| Spring Boot                                   | 3.4.3                              |
| **Build Tool**       | Maven                                         | 3.9.16                             |
| **Database**         | PostgreSQL (hosted on Neon)                   | 18 (cloud)                         |
| **ORM**              | Spring Data JPA (Hibernate)                   | 6.6.8.Final                        |
| **API Documentation**| Springdoc OpenAPI (Swagger UI)                | 2.6.0                              |
| **Frontend Library** | React                                         | 19.0.0                             |
| **Frontend Build**   | Vite                                          | 6.4.3                              |
| **Styling**          | Tailwind CSS                                  | 3.4.17                             |
| **Icons**            | Google Material Symbols (via CDN)             |                                     |
| **HTTP Client**      | Axios                                         | 1.7.9                              |
| **Deployment**       | Render (backend), Vercel (frontend)          | Free tier                          |
| **Database Hosting** | Neon                                          | Free tier (0.5 GB)                 |
| **Version Control**  | Git + GitHub                                  |                                     |

## 3. Key Features

### 3.1. Task Management
- Create, read, update, and delete tasks.
- Assign a priority (1-10) to each task.
- Define dependencies between tasks (a task can wait for one or more others to complete).
- Filter tasks by status and search by name.
- Undo the last state change of a task (powered by a custom stack).

### 3.2. Workflow Orchestration
- Group tasks into reusable workflows.
- Automatically resolve task dependencies using a directed acyclic graph (DAG) and topological sort.
- Execute workflows with priority‑based scheduling (max‑heap ensures highest priority tasks run first).
- Real‑time execution logs stored in the database.
- Save any workflow as a template (stored in an AVL tree for fast retrieval).
- Create new workflows from existing templates.

### 3.3. Resource Management
- Define system resources (e.g., CPU, memory, GPU) with total and available capacities.
- Visualise usage with colour‑coded progress bars.
- Automatic allocation and release of resources during workflow execution.

### 3.4. Undo History
- Every task state change during execution is pushed onto a stack.
- Users can revert a task to its previous state via the undo endpoint.

### 3.5. Dashboard and Monitoring
- Real‑time summary cards for total tasks, workflows, and resource usage.
- Recent execution logs and activity feed.
- Quick‑action buttons to create tasks, workflows, or templates.

### 3.6. Full‑Stack Integration
- RESTful APIs with OpenAPI/Swagger documentation.
- Responsive, dark‑theme user interface.
- Automatic proxy configuration for local development.

## 4. Architecture Overview

The application follows a standard **Model‑View‑Controller (MVC)** pattern with a clear separation of concerns.

### Backend Layers
- **Controller Layer**: REST endpoints (TaskController, WorkflowController, ResourceController, UndoController).
- **Service Layer**: Business logic (SchedulingService, WorkflowService, ExecutionService, ResourceManager, UndoManager, WorkflowTemplateCache).
- **Repository Layer**: JPA interfaces for database access (TaskRepository, WorkflowRepository, ResourceRepository, ExecutionLogRepository).
- **Model Layer**: JPA entities (Task, Workflow, Resource, ExecutionLog).
- **Data Structures**: Custom implementations of MaxHeap, AdjacencyListGraph, AvlTree, and UndoStack are used within the services.
- **Configuration**: CORS configuration and data loader (seeds sample data on first run).

### Frontend Structure
- **Pages**: Dashboard, Tasks, Workflows, Resources, Templates, Undo History.
- **Components**: Reusable UI elements (cards, tables, forms, modals, charts) grouped by feature.
- **Services**: Axios client with all API endpoints.
- **Routing**: React Router for navigation.

### Data Flow
1. User interacts with the frontend.
2. Frontend sends HTTP requests to the backend API (via proxy in development, direct URL in production).
3. Backend controllers invoke services, which use data structures and repositories.
4. Database operations are performed through JPA.
5. Results are returned as JSON and rendered by the frontend.

## 5. Data Structures and Algorithms

The project intentionally uses custom implementations of key data structures to demonstrate their practical application:

| Data Structure      | Purpose                                                      | File Location                                  |
|---------------------|--------------------------------------------------------------|------------------------------------------------|
| **MaxHeap**         | Priority queue for scheduling tasks (highest priority first).| `com.workflow.ds.MaxHeap`                      |
| **AdjacencyListGraph** | Model task dependencies; topological sort to determine execution order. | `com.workflow.ds.AdjacencyListGraph` |
| **AvlTree**         | Cache for workflow templates (O(log n) insert, search, delete). | `com.workflow.ds.AvlTree`                      |
| **UndoStack**       | LIFO stack for saving and reverting task states.            | `com.workflow.ds.UndoStack`                    |

**Algorithms used:**
- Topological sort (Kahn’s algorithm) on the dependency graph.
- Heapify operations for insertion and extraction of max priority task.

## 6. Local Development Setup

### Prerequisites
- Java 21 (JDK)
- Maven 3.9+
- Node.js 18+ and npm
- Git

### Clone the Repository
```bash
git clone https://github.com/zahmed02/workflow-orchestration-engine.git
cd workflow-orchestration-engine
```

### Backend
1. Create a `.env` file in the `backend` folder with your Neon PostgreSQL credentials:
   ```env
   DB_HOST=your-neon-host
   DB_PORT=5432
   DB_NAME=neondb
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   ```
2. Build and run:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```
3. The API will be available at `http://localhost:8080`.
4. Swagger UI: `http://localhost:8080/swagger-ui.html`.

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Access the UI at `http://localhost:5173`.

### Database
- By default, the application uses a PostgreSQL database hosted on Neon.
- The schema is auto‑generated by Hibernate (spring.jpa.hibernate.ddl‑auto=update).
- On first run, a `DataLoader` seeds the database with sample tasks and workflows.

## 7. Deployment

### Backend Render
1. Push the code to a GitHub repository.
2. On Render, create a new Web Service and connect your repository.
3. Set the **Root Directory** to `backend`.
4. Choose **Docker** as the environment (the `Dockerfile` is provided).
5. Add the following environment variables:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, `PORT` (set to `8080`).
6. Deploy. The service will be available at a `onrender.com` URL.

### Frontend Vercel
1. Import the same GitHub repository on Vercel.
2. Set the **Root Directory** to `frontend`.
3. Choose **Vite** as the framework.
4. Add the environment variable `VITE_API_URL` with the Render backend URL.
5. Deploy. The frontend will be served at a `vercel.app` URL.

### Database Neon
1. Sign up at [Neon](https://neon.tech).
2. Create a project and database.
3. Copy the connection string and use it in the backend environment variables.

## 8. API Endpoints (Summary)

| Method | Endpoint                       | Description                         |
|--------|--------------------------------|-------------------------------------|
| GET    | `/api/tasks`                   | List all tasks (with filters)      |
| POST   | `/api/tasks`                   | Create a new task                  |
| GET    | `/api/tasks/{id}`              | Get a specific task                |
| PUT    | `/api/tasks/{id}`              | Update a task                      |
| DELETE | `/api/tasks/{id}`              | Delete a task                      |
| POST   | `/api/tasks/{id}/undo`         | Undo the last change of a task     |
| GET    | `/api/workflows`               | List all workflows                 |
| POST   | `/api/workflows`               | Create a workflow                  |
| GET    | `/api/workflows/{id}`          | Get workflow details               |
| POST   | `/api/workflows/{id}/execute`  | Execute a workflow                 |
| DELETE | `/api/workflows/{id}`          | Delete a workflow                  |
| GET    | `/api/resources`               | List all resources                 |
| POST   | `/api/resources`               | Create a resource                  |
| PUT    | `/api/resources/{id}`          | Update a resource                  |
| DELETE | `/api/resources/{id}`          | Delete a resource                  |
| GET    | `/api/workflows/templates`     | List all template names            |
| POST   | `/api/workflows/templates/{name}` | Save a workflow as template    |
| GET    | `/api/workflows/templates/{name}` | Retrieve a template             |
| DELETE | `/api/workflows/templates/{name}` | Delete a template               |
| GET    | `/api/undo/history`            | Get the undo stack                 |
| GET    | `/api/logs/recent`             | Get recent execution logs          |
| GET    | `/health`                      | Health check                       |

Full documentation is available via Swagger UI at `/swagger-ui.html`.

## 9. Testing and Validation

- **Postman Collection**: A collection of API requests is available for testing all endpoints (not included in the repo but can be generated from Swagger).
- **Browser Console**: Frontend API calls can be tested directly from the developer console.
- **Logs**: Both backend (Render logs) and frontend (browser console) provide visibility.

## 10. Future Enhancements

- Add user authentication and authorisation (Spring Security + JWT).
- Implement real‑time updates using WebSockets.
- Add pagination for tasks and workflows.
- Create a visual DAG editor for workflows.
- Write comprehensive unit and integration tests.
- Add CI/CD pipelines with GitHub Actions.
