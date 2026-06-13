class TaskManager {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        this.tasks = [];
        this.editingTaskId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTasks();
    }

    bindEvents() {
        // Form submission
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createTask();
        });

        // Edit modal events
        document.getElementById('editTaskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateTask();
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeModal();
        });

        // Close modal when clicking outside
        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeModal();
            }
        });

        // Real-time validation
        document.getElementById('taskTitle').addEventListener('input', () => {
            this.validateTitle('taskTitle', 'titleError');
        });

        document.getElementById('editTaskTitle').addEventListener('input', () => {
            this.validateTitle('editTaskTitle', 'editTitleError');
        });
    }

    validateTitle(inputId, errorId) {
        const input = document.getElementById(inputId);
        const errorElement = document.getElementById(errorId);
        const title = input.value.trim();

        if (!title) {
            errorElement.textContent = 'Title is required';
            input.style.borderColor = '#e74c3c';
            return false;
        }

        errorElement.textContent = '';
        input.style.borderColor = '#e1e5e9';
        return true;
    }

    async loadTasks() {
        try {
            this.showLoading();
            const response = await fetch(`${this.baseURL}/tasks`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.tasks = await response.json();
            this.renderTasks();
            this.updateStats();
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.showError('Failed to load tasks. Please check if the server is running.');
        }
    }

    async createTask() {
        if (!this.validateTitle('taskTitle', 'titleError')) {
            return;
        }

        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const status = document.getElementById('taskStatus').value;

        try {
            const response = await fetch(`${this.baseURL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    status
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to create task');
            }

            const newTask = await response.json();
            this.tasks.unshift(newTask);
            this.renderTasks();
            this.updateStats();
            this.resetForm();
            this.showSuccess('Task created successfully!');
        } catch (error) {
            console.error('Error creating task:', error);
            this.showError(error.message);
        }
    }

    async updateTask() {
        if (!this.validateTitle('editTaskTitle', 'editTitleError') || !this.editingTaskId) {
            return;
        }

        const title = document.getElementById('editTaskTitle').value.trim();
        const description = document.getElementById('editTaskDescription').value.trim();
        const status = document.getElementById('editTaskStatus').value;

        try {
            const response = await fetch(`${this.baseURL}/tasks/${this.editingTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description: description || null,
                    status
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to update task');
            }

            const updatedTask = await response.json();
            const taskIndex = this.tasks.findIndex(task => task.id === this.editingTaskId);
            
            if (taskIndex !== -1) {
                this.tasks[taskIndex] = updatedTask;
                this.renderTasks();
                this.updateStats();
            }

            this.closeModal();
            this.showSuccess('Task updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            this.showError(error.message);
        }
    }

    async deleteTask(taskId) {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        try {
            const response = await fetch(`${this.baseURL}/tasks/${taskId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.renderTasks();
            this.updateStats();
            this.showSuccess('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            this.showError(error.message);
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        this.editingTaskId = taskId;
        
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description || '';
        document.getElementById('editTaskStatus').value = task.status;
        
        document.getElementById('editModal').style.display = 'block';
    }

    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
        
        // Clear validation errors
        document.getElementById('editTitleError').textContent = '';
        document.getElementById('editTaskTitle').style.borderColor = '#e1e5e9';
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        
        if (this.tasks.length === 0) {
            tasksList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No tasks yet</h3>
                    <p>Create your first task to get started!</p>
                </div>
            `;
            return;
        }

        tasksList.innerHTML = this.tasks.map(task => `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-header">
                    <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
                    <div class="task-actions">
                        <button class="btn-edit" onclick="taskManager.editTask(${task.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="taskManager.deleteTask(${task.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
                <div class="task-meta">
                    <span class="task-status status-${task.status.replace(' ', '-')}">${task.status}</span>
                    <span class="task-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${this.formatDate(task.created_at)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        document.getElementById('totalTasks').textContent = this.tasks.length;
    }

    resetForm() {
        document.getElementById('taskForm').reset();
        document.getElementById('titleError').textContent = '';
        document.getElementById('taskTitle').style.borderColor = '#e1e5e9';
    }

    showLoading() {
        document.getElementById('tasksList').innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Loading tasks...
            </div>
        `;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            ${type === 'success' ? 'background: #27ae60;' : 'background: #e74c3c;'}
        `;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application
const taskManager = new TaskManager();

// Service worker registration for potential PWA features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Taskify app loaded successfully');
    });
}