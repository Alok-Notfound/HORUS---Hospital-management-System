# Stage 1: Build React Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup Python FastAPI Backend & serve frontend
FROM python:3.10-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend & Data
COPY backend/ ./backend/
COPY data/ ./data/

# Copy built frontend dist to backend/frontend/dist
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

# Expose port
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV HOST=0.0.0.0

# Start unified FastAPI server
CMD ["python", "app.py"]
