# Backend (FastAPI)


## Setup


1. Create a Python virtualenv: `python -m venv venv` and activate it.
2. Install: `pip install -r requirements.txt`
3. Run the app: `uvicorn main:app --reload --port 8000`


## Endpoints


- POST /process-report
- body: {"report": "..."}
- returns extracted fields


- GET /reports
- returns saved history


- GET /translate?outcome=recovered&lang=fr
- returns translation for outcome (fr or sw)