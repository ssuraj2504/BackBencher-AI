How to run

**Backend**

cd backend
python -m venv venv
venv\scripts\activate
pip install - r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8080 --reload

fix the path of llama in llm.py in core folder
