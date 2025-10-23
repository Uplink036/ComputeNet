import requests
import time
import os
import sys

CONTROLLER_URL = os.getenv("CONTROLLER_URL", "http://localhost:3000")
TIME_BETWEEN_TASKS = int(os.getenv("TIME_BETWEEN_TASKS", "5"))
TIME_FOR_ERRORS = 2*TIME_BETWEEN_TASKS

def get_task():
    response = requests.get(f"{CONTROLLER_URL}/api/task")
    return response.json().get("task")

def submit_result(task, result):
    data = {"task": task, "result": result}
    response = requests.post(f"{CONTROLLER_URL}/api/task/submit", json=data)
    return response.json().get("success")

def collatz_odd(num):
    return 3*num + 1

def collats_even(num):
    return num/2

def process_task(task):
    current_num = task
    sequence = []
    while current_num != 1:
        if current_num % 2 == 0:
            current_num = collats_even(current_num)
        else:
            current_num = collatz_odd(current_num)
        sequence.append(current_num)
    return len(sequence)


def main():
    while True:
        try:
            task = get_task()
            if task:
                print(f"Processing task: {task}")
                result = process_task(task)
                success = submit_result(task, result)
                print(f"Submitted result {result}: {'success' if success else 'failed'}")
            else:
                print("No task available")
            time.sleep(TIME_BETWEEN_TASKS)
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(TIME_FOR_ERRORS)

if __name__ == "__main__":
    main()
