from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import json
from googletrans import Translator
import time  # For the delay
import re  # Ensure this is present
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS for frontend (React on different port and Vercel deployment)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://mini-regulatory-report-assistant.vercel.app/",  # Replace with your actual Vercel URL
        "https://*.vercel.app"  # Allow all Vercel subdomains (less secure but convenient)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB setup
conn = sqlite3.connect('reports.db', check_same_thread=False)
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        drug TEXT,
        adverse_events TEXT,
        severity TEXT,
        outcome TEXT
    )
''')
conn.commit()

class Report(BaseModel):
    report: str

class TranslateRequest(BaseModel):
    outcome: str
    lang: str  # 'fr' for French, 'sw' for Swahili

@app.post("/process-report")
def process_report(report: Report):
    text = report.report
    drug_match = re.search(r'taking (.+?)\.', text)
    drug = drug_match.group(1) if drug_match else "Unknown"
    severity_match = re.search(r'(mild|moderate|severe)', text, re.I)
    severity = severity_match.group(1).lower() if severity_match else "unknown"
    outcome_match = re.search(r'(recovered|ongoing|fatal)', text, re.I)
    outcome = outcome_match.group(1).lower() if outcome_match else "unknown"
    events_match = re.search(r'experienced (.+?) after', text)
    adverse_events = []
    if events_match:
        events_str = events_match.group(1)
        events_str = re.sub(r'(mild|moderate|severe) ', '', events_str, flags=re.I)
        adverse_events = [e.strip() for e in events_str.split(' and ')]
    
    result = {
        "drug": drug,
        "adverse_events": adverse_events,
        "severity": severity,
        "outcome": outcome
    }
    
    cursor.execute('''
        INSERT INTO reports (drug, adverse_events, severity, outcome)
        VALUES (?, ?, ?, ?)
    ''', (drug, json.dumps(adverse_events), severity, outcome))
    conn.commit()
    
    return result

@app.get("/reports")
def get_reports():
    cursor.execute('SELECT * FROM reports')
    rows = cursor.fetchall()
    reports = []
    for row in rows:
        reports.append({
            "id": row[0],
            "drug": row[1],
            "adverse_events": json.loads(row[2]),
            "severity": row[3],
            "outcome": row[4]
        })
    return reports

@app.get("/translate")
async def translate_outcome(outcome: str = None, lang: str = "fr"):
    if outcome is None:
        raise HTTPException(status_code=400, detail="outcome parameter is required")
    if lang not in ["fr", "sw"]:
        raise HTTPException(status_code=400, detail="lang must be 'fr' or 'sw'")
    
    translator = Translator()
    try:
        print(f"Translating '{outcome}' to {lang}")  # Debug log
        time.sleep(1)  # Add delay to avoid rate limiting
        translation = translator.translate(outcome, dest=lang).text
        print(f"Translated to: {translation}")  # Debug log
        return {"translation": translation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation error: {str(e)}")