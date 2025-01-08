FROM python:3.8.1-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    graphviz \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY LLMs/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY LLMs/ .
EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]