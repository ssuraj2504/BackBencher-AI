# BackBencher AI Tutor

BackBencher AI is an intelligent tutoring system that combines a robust **FastAPI** backend with a modern **React** frontend. It uses local LLMs (via Ollama) to answer student questions and RAG (Retrieval-Augmented Generation) to chat with PDF documents.

## 🚀 Features

-   **AI Chat**: Interactive chat with local LLMs (e.g., Phi-3, Llama3).
-   **RAG System**: Upload PDFs and ask questions based on their content.
-   **Session Management**: Track learning sessions by subject.
-   **Modern UI**: Built with React, Vite, Tailwind CSS, and Framer Motion.
-   **Secure Auth**: JWT-based authentication (Login/Register).

## 🛠️ Tech Stack

-   **Backend**: Python, FastAPI, SQLAlchemy, Alembic, LangChain.
-   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Zustand.
-   **AI/LLM**: Ollama (Local), Sentence Transformers (Embeddings).
-   **Database**: SQLite (Default), scalable to PostgreSQL.

---

## 📋 Prerequisites

Before you start, ensure you have the following installed:

1.  **Python 3.10+**: [Download Here](https://www.python.org/downloads/)
2.  **Node.js 18+**: [Download Here](https://nodejs.org/)
3.  **Ollama**: [Download Here](https://ollama.com/) (Required for AI features)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/backbencher-ai.git
cd backbencher-ai
```

### 2. Backend Setup
Navigate to the `backend` folder and set up the Python environment.

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

**Configuration (.env):**
1.  Copy `.env.example` to `.env`.
    ```bash
    cp .env.example .env
    ```
2.  (Optional) Update `LLMA_SERVER_URL` if your Ollama instance is on a different port.

**Database Migrations:**
Initialize the database tables.
```bash
alembic upgrade head
```

### 3. Frontend Setup
Navigate to the `frontend` folder and install dependencies.

```bash
cd ../frontend
npm install
```

### 4. Setup AI Model (Ollama)
Pull the model specified in your backend `.env` (default is `phi3`).
```bash
ollama pull phi3
ollama serve
```

---

## ▶️ Running the Application

### Option 1: One-Click Script (Windows) ⚡
Simply double-click the `start_dev.bat` file in the root directory. This will launch both the backend and frontend in separate terminals.

### Option 2: Manual Start

**Terminal 1: Backend**
```bash
cd backend
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

Open your browser at **http://localhost:5173**.

---

## 📂 Project Structure

```
/
├── backend/            # FastAPI Application
│   ├── app/            # Core logic, Routes, Models
│   ├── alembic/        # Database Migrations
│   └── requirements.txt
├── frontend/           # React Application
│   ├── src/            # Components, Pages, Stores
│   └── tailwind.config.js
└── start_dev.bat       # Windows Startup Script
```
