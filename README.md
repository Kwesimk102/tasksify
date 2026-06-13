# 🚀 Taskify - Full-Stack Task Management Application

A modern, responsive task management web application built with **FastAPI** (Python) backend and **vanilla HTML/CSS/JavaScript** frontend.

## ✨ Features

### Core Functionality
- ✅ **Create Tasks** - Add new tasks with title, description, and status
- 📖 **Read Tasks** - View all tasks in a clean, organized interface
- ✏️ **Update Tasks** - Edit existing tasks with inline modal editing
- 🗑️ **Delete Tasks** - Remove tasks with confirmation dialog

### Advanced Features
- 🎯 **Real-time Validation** - Client & server-side validation
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI/UX** - Clean interface with smooth animations
- ⚡ **Fast API** - Automatic API documentation with Swagger UI
- 🔒 **Data Persistence** - SQLite database with SQLAlchemy ORM
- 📊 **Task Statistics** - Live task count and status indicators

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server implementation

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Flexbox/Grid
- **JavaScript (ES6+)** - Async/await, Classes, Modules
- **Font Awesome** - Icon library

### Database
- **SQLite** - Lightweight database (easily upgradeable to PostgreSQL)

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 🚀 Quick Start

### Option 1: Automatic Setup (Windows)
```bash
# Run the automated setup script
start.bat
```

### Option 2: Manual Setup
```bash
# 1. Create virtual environment
python -m venv venv

# 2. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the application
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 3: Docker Setup
```bash
# Build and run with Docker Compose
docker-compose up --build

# Access the application
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 🌐 Access Points

Once running, access the application at:

- **Frontend**: [http://localhost:8000/static/index.html](http://localhost:8000/static/index.html)
- **API Backend**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative API Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| POST | `/tasks` | Create a new task |
| GET | `/tasks/{id}` | Get a specific task |
| PUT | `/tasks/{id}` | Update a task |
| DELETE | `/tasks/{id}` | Delete a task |

### Example API Usage

```javascript
// Create a new task
const response = await fetch('http://localhost:8000/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'Complete project documentation',
        description: 'Write comprehensive README and API docs',
        status: 'pending'
    })
});
```

## 📁 Project Structure

```
tasksify/
├── backend/
│   ├── __init__.py
│   ├── main.py          # FastAPI application entry point
│   ├── models.py        # SQLAlchemy database models
│   ├── schemas.py       # Pydantic validation schemas
│   └── database.py      # Database configuration
├── frontend/
│   ├── index.html       # Main HTML file
│   ├── styles.css       # CSS styles and animations
│   └── script.js        # JavaScript functionality
├── requirements.txt     # Python dependencies
├── docker-compose.yml   # Docker orchestration
├── Dockerfile          # Docker container configuration
├── start.bat           # Windows startup script
└── README.md           # This file
```

## 🎯 Task Data Model

```json
{
    "id": 1,
    "title": "Complete Taskify project",
    "description": "Build a full-stack task management app",
    "status": "in-progress",
    "created_at": "2024-01-15T10:30:00"
}
```

### Status Options
- `pending` - Task not started
- `in-progress` - Task currently being worked on
- `completed` - Task finished

## 🔧 Configuration

### Database Configuration
The application uses SQLite by default. To switch to PostgreSQL:

1. Update `database.py`:
```python
DATABASE_URL = "postgresql://username:password@localhost/taskify"
```

2. Install PostgreSQL adapter:
```bash
pip install psycopg2-binary
```

### Environment Variables
- `DATABASE_URL` - Database connection string
- `DEBUG` - Enable debug mode (default: True)

## 🧪 Testing the API

Use the interactive API documentation at [http://localhost:8000/docs](http://localhost:8000/docs) to test all endpoints directly in your browser.

Or use curl:

```bash
# Get all tasks
curl http://localhost:8000/tasks

# Create a task
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "status": "pending"}'

# Update a task
curl -X PUT http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Task", "status": "completed"}'

# Delete a task
curl -X DELETE http://localhost:8000/tasks/1
```

## 🚀 Deployment

### Production Deployment
For production deployment, consider:

1. **Database**: Switch to PostgreSQL or MySQL
2. **Server**: Use Gunicorn with multiple workers
3. **Reverse Proxy**: Nginx for static files and SSL
4. **Environment**: Set environment variables for production

Example production command:
```bash
gunicorn backend.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Task categories and tags
- [ ] Due dates and reminders
- [ ] File attachments
- [ ] Real-time collaboration
- [ ] Mobile app (React Native)
- [ ] Task analytics and reporting
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Advanced search and filtering

---

**Built with ❤️ for learning full-stack development**