from typing import Optional

# Simple data classes without Pydantic for compatibility
class TaskBase:
    def __init__(self, title: str, description: Optional[str] = None, status: str = "pending"):
        if not title or not title.strip():
            raise ValueError('Title is required and cannot be empty')
        
        allowed_statuses = ["pending", "in-progress", "completed"]
        if status not in allowed_statuses:
            raise ValueError(f'Status must be one of: {", ".join(allowed_statuses)}')
        
        self.title = title.strip()
        self.description = description
        self.status = status

class TaskCreate(TaskBase):
    pass

class TaskUpdate:
    def __init__(self, title: Optional[str] = None, description: Optional[str] = None, status: Optional[str] = None):
        if title is not None and (not title or not title.strip()):
            raise ValueError('Title cannot be empty')
        if status is not None:
            allowed_statuses = ["pending", "in-progress", "completed"]
            if status not in allowed_statuses:
                raise ValueError(f'Status must be one of: {", ".join(allowed_statuses)}')
        
        self.title = title.strip() if title else title
        self.description = description
        self.status = status