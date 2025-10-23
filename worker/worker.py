import requests
import time
import os
import sys
import signal 

DEBUG = bool(os.getenv("DEBUG", 0))
assert DEBUG in (True, False)
CONTROLLER_URL = os.getenv("CONTROLLER_URL", "http://localhost:3000")
assert isinstance(CONTROLLER_URL, str)
TIME_BETWEEN_TASKS = float(os.getenv("TIME_BETWEEN_TASKS", "5"))
assert isinstance(TIME_BETWEEN_TASKS, float)
TIME_FOR_ERRORS = 2*TIME_BETWEEN_TASKS


def debug_print(message):
    if DEBUG:
        print(f"[DEBUG] {message}")

def get_task():
    debug_print("Entering get_task()")
    response = requests.get(f"{CONTROLLER_URL}/api/task")
    task = response.json().get("task")
    debug_print(f"Exiting get_task() with task: {task}")
    return task

def submit_result(task, result):
    debug_print(f"Entering submit_result() with task: {task}, result: {result}")
    data = {"task": task, "result": result}
    response = requests.post(f"{CONTROLLER_URL}/api/task/submit", json=data)
    success = response.json().get("success")
    debug_print(f"Exiting submit_result() with success: {success}")
    return success

def collatz_odd(num):
    result = 3*num + 1
    return result

def collatz_even(num):
    result = num//2
    return result

def process_task(task):
    debug_print(f"Entering process_task() with task: {task}")
    current_num = task
    sequence = []
    while current_num != 1:
        if current_num % 2 == 0:
            current_num = collatz_even(current_num)
        else:
            current_num = collatz_odd(current_num)
        sequence.append(current_num)
    result = len(sequence)
    debug_print(f"Exiting process_task() with result: {result}")
    return result

def main():
    debug_print("Entering main()")
    stop = False
    def exit_gracefully():
        global stop
        stop = True
    signal.signal(signal.SIGTERM, exit_gracefully)

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
            if stop:
                break 
        except Exception as e:
            print(f"Error: {e}")
            time.sleep(TIME_FOR_ERRORS)


# API server

from fastapi import FastAPI 
from multiprocessing import Process
from contextlib import asynccontextmanager

process = None

@asynccontextmanager
async def startup_event(app):
    print("Starting")
    global process
    process = Process(target=main)
    process.start()
    yield
    process.terminate()
    print("Stoping")

app = FastAPI(lifespan=startup_event)

@app.get("/")
def root():
    global process
    if process.is_alive():
        return {"health": True}
    else:
        sys.exit(1)