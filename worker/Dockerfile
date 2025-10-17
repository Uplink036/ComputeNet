FROM python:3.11-slim

WORKDIR /app

COPY pyproject.toml .
RUN pip install .

COPY worker.py .

CMD ["python", "worker.py"]