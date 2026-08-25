# Internal Task Management Dashboard

A full-stack task management application for managing team tasks, assignments, priorities, statuses, due dates, and comments. It includes a React dashboard and a FastAPI REST API backed by SQLite.

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- HTTPX
- Uvicorn

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios

## Key Features

- Dashboard task metrics
- Task creation, viewing, editing, and deletion
- Delete confirmation
- Task search
- Status, priority, and assignee filters
- API sorting and pagination
- User creation and listing
- Task comments
- Loading, error, and empty UI states
- External user directory integration
- Responsive internal-tool interface

## Project Structure

```text
.
├── backend/
│   ├── comments.py       # Task comments endpoints
│   ├── dashboard.py      # Dashboard metrics endpoint
│   ├── database.py       # SQLAlchemy engine and session
│   ├── external.py       # External users integration
│   ├── main.py           # FastAPI application
│   ├── models.py         # SQLAlchemy models
│   ├── requirements.txt  # Python dependencies
│   ├── schemas.py        # Pydantic schemas
│   ├── tasks.py          # Task CRUD and querying
│   └── users.py          # User endpoints
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── TaskForm.jsx
│   │   ├── pages/
│   │   │   ├── CreateTask.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EditTask.jsx
│   │   │   ├── ExternalUsers.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Backend Setup

From the repository root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

On Windows, activate the virtual environment with:

```powershell
.venv\Scripts\activate
```

### Run the Backend

Run the command from the `backend/` directory:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The API will be available at:

- API: http://127.0.0.1:8000
- Swagger documentation: http://127.0.0.1:8000/docs
- ReDoc documentation: http://127.0.0.1:8000/redoc

## Frontend Setup

From the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend CORS configuration currently allows this origin.

Other frontend commands:

```bash
npm run lint
npm run build
npm run preview
```

## Database

The application uses SQLite through SQLAlchemy.

The configured connection is:

```text
sqlite:///./tasks.db
```

Database tables are created automatically when the FastAPI application starts. Run the backend from the `backend/` directory so the database is created at `backend/tasks.db`.

The local database file is ignored by Git. The project does not currently use migrations or seed scripts.

## Environment Variables

No environment variables are currently required.

The following values are configured directly in the source:

- SQLite database URL
- Frontend API base URL
- Allowed CORS origin
- External users API URL
- Current user ID used by dashboard and comments behavior

For deployment, these values should be moved to environment-based configuration.

## Main API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API health message |
| `GET` | `/api/dashboard` | Dashboard task metrics |
| `GET` | `/api/users` | List users |
| `POST` | `/api/users` | Create a user |
| `GET` | `/api/tasks` | List and query tasks |
| `POST` | `/api/tasks` | Create a task |
| `GET` | `/api/tasks/{task_id}` | Get task details |
| `PUT` | `/api/tasks/{task_id}` | Update a task |
| `DELETE` | `/api/tasks/{task_id}` | Delete a task |
| `GET` | `/api/tasks/{task_id}/comments` | List task comments |
| `POST` | `/api/tasks/{task_id}/comments` | Add a task comment |
| `GET` | `/api/external/users` | List transformed external users |

### Task Query Parameters

`GET /api/tasks` supports:

| Parameter | Description |
|---|---|
| `search` | Case-insensitive task-title search |
| `status` | Filter by task status |
| `priority` | Filter by priority |
| `assignee` | Filter by assigned user ID |
| `page` | Page number, starting at 1 |
| `limit` | Results per page, from 1 to 100 |
| `sort_by` | Task column used for sorting |
| `sort_order` | `asc` for ascending; all other values use descending |

Invalid `sort_by` values fall back to `created_at`. The frontend task list currently requests five tasks per page for demonstration purposes.

## External API Integration

The backend fetches users from:

```text
https://jsonplaceholder.typicode.com/users
```

`GET /api/external/users` returns only:

- `id`
- `name`
- `email`
- `phone`
- `company_name`

The integration uses HTTPX with a 10-second timeout. Upstream request failures and invalid responses return HTTP `502`.

## Assumptions

- The local frontend runs at `http://localhost:5173`.
- The local backend runs at `http://127.0.0.1:8000`.
- Task statuses are `pending`, `in_progress`, `completed`, or `blocked`.
- Task priorities are `low`, `medium`, or `high`.
- The temporary current-user ID is `1`.
- Dates are stored and returned as date-time values.
- User records are managed through the Users API.

## Known Limitations

- Authentication and authorization are not implemented.
- The current-user ID is hard-coded.
- Runtime configuration is not environment-driven.
- SQLite is intended for local development and assessment use.
- Database migrations and seed data are not included.
- Task-list responses do not include a total count, so frontend pagination infers whether another page may exist from the current result count.
- The task UI displays assignee IDs rather than resolved user names.
- Frontend sorting controls are not implemented, although the API supports sorting.
- External users depend on the availability of JSONPlaceholder.
