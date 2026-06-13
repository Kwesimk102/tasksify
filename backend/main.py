from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from . import models, schemas
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Taskify API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
app.mount("/static", StaticFiles(directory="frontend"), name="static")

def task_to_dict(task) -> Dict[str, Any]:
    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "status": task.status,
        "created_at": task.created_at.isoformat()
    }

@app.get("/")
async def root():
    return {"message": "Taskify API is running"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.Task).all()
    return [task_to_dict(task) for task in tasks]

@app.post("/tasks")
def create_task(task_data: dict, db: Session = Depends(get_db)):
    try:
        # Validate the input
        task_schema = schemas.TaskCreate(
            title=task_data.get("title", ""),
            description=task_data.get("description"),
            status=task_data.get("status", "pending")
        )
        
        db_task = models.Task(
            title=task_schema.title,
            description=task_schema.description,
            status=task_schema.status
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return task_to_dict(db_task)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/tasks/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task_to_dict(task)

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task_data: dict, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    try:
        # Validate the input
        task_update = schemas.TaskUpdate(
            title=task_data.get("title"),
            description=task_data.get("description"),
            status=task_data.get("status")
        )
        
        if task_update.title is not None:
            task.title = task_update.title
        if task_update.description is not None:
            task.description = task_update.description
        if task_update.status is not None:
            task.status = task_update.status
        
        db.commit()
        db.refresh(task)
        return task_to_dict(task)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)