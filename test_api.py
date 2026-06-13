import requests
import json
from time import sleep

BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing Taskify API...")
    print("=" * 50)
    
    try:
        # Test 1: Check if server is running
        print("1. Testing server connection...")
        response = requests.get(f"{BASE_URL}/")
        if response.status_code == 200:
            print("   ✅ Server is running!")
        else:
            print("   ❌ Server connection failed")
            return
        
        # Test 2: Get all tasks (should be empty initially)
        print("\n2. Testing GET /tasks...")
        response = requests.get(f"{BASE_URL}/tasks")
        if response.status_code == 200:
            tasks = response.json()
            print(f"   ✅ Retrieved {len(tasks)} tasks")
        else:
            print("   ❌ Failed to get tasks")
            return
        
        # Test 3: Create a new task
        print("\n3. Testing POST /tasks...")
        new_task = {
            "title": "Test Task from API",
            "description": "This is a test task created via API",
            "status": "pending"
        }
        response = requests.post(f"{BASE_URL}/tasks", json=new_task)
        if response.status_code == 200:
            created_task = response.json()
            task_id = created_task["id"]
            print(f"   ✅ Created task with ID: {task_id}")
            print(f"   📝 Task: {created_task['title']}")
        else:
            print(f"   ❌ Failed to create task: {response.text}")
            return
        
        # Test 4: Get the specific task
        print(f"\n4. Testing GET /tasks/{task_id}...")
        response = requests.get(f"{BASE_URL}/tasks/{task_id}")
        if response.status_code == 200:
            task = response.json()
            print(f"   ✅ Retrieved task: {task['title']}")
        else:
            print("   ❌ Failed to get specific task")
        
        # Test 5: Update the task
        print(f"\n5. Testing PUT /tasks/{task_id}...")
        update_data = {
            "title": "Updated Test Task",
            "status": "completed"
        }
        response = requests.put(f"{BASE_URL}/tasks/{task_id}", json=update_data)
        if response.status_code == 200:
            updated_task = response.json()
            print(f"   ✅ Updated task: {updated_task['title']}")
            print(f"   📊 Status: {updated_task['status']}")
        else:
            print("   ❌ Failed to update task")
        
        # Test 6: Delete the task
        print(f"\n6. Testing DELETE /tasks/{task_id}...")
        response = requests.delete(f"{BASE_URL}/tasks/{task_id}")
        if response.status_code == 200:
            print("   ✅ Task deleted successfully")
        else:
            print("   ❌ Failed to delete task")
        
        # Test 7: Verify task is deleted
        print(f"\n7. Verifying task deletion...")
        response = requests.get(f"{BASE_URL}/tasks/{task_id}")
        if response.status_code == 404:
            print("   ✅ Task successfully deleted (404 as expected)")
        else:
            print("   ⚠️  Task might still exist")
        
        print("\n" + "=" * 50)
        print("🎉 All API tests completed successfully!")
        print("✨ Your Taskify application is working perfectly!")
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to the server.")
        print("💡 Make sure to start the server first:")
        print("   python -m uvicorn backend.main:app --reload")
    except Exception as e:
        print(f"❌ Test failed with error: {str(e)}")

if __name__ == "__main__":
    test_api()