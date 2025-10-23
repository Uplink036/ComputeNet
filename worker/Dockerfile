FROM python:3.11-slim

ENV CONTROLLER_URL=http://localhost:3000
ENV TIME_BETWEEN_TASKS=5
ENV PORT=11111

WORKDIR /app

COPY pyproject.toml .
RUN pip install .

COPY worker.py .

CMD ["fastapi", "run", "worker.py"]