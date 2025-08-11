FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y gcc \
  && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN mkdir -p /app/data

EXPOSE 8000

ENV PYTHONPATH=/app
ENV DATABASE_URL=sqlite:///./data/therapist_matching.db

# ensure curl in image for healthcheck OR rely on Coolify healthcheck
RUN apt-get update && apt-get install -y curl \
  && rm -rf /var/lib/apt/lists/*

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# use uvicorn to run the FastAPI app, 
# adjust `main:app` to match your application entry (module:app)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]