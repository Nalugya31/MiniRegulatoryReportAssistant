# Mini Regulatory Report Assistant

This is a full-stack web application designed to process medical regulatory reports, extract structured data (drug, adverse events, severity, outcome), store them in a database, provide translation support for outcomes, and visualize severity distribution using a pie chart. 
The project includes a FastAPI backend and a React frontend.

## Features
- Process medical reports and extract key fields (drug, adverse events, severity, outcome).
- Store processed reports in a SQLite database (deployed with persistence considerations).
- Retrieve and display report history on a dedicated page.
- Translate outcomes into French or Swahili.
- Visualize severity distribution with a Chart.js pie chart.

## Project Structure
- `/backend`: Contains the FastAPI server (`main.py`), virtual environment setup, and `requirements.txt`.
- `/frontend`: Contains the React application (source code in `src/`).
- `README.md`: This file.

## Prerequisites
- **Python 3.10+** for the backend.
- **Node.js and npm** for the frontend.
- **Git** for version control.
- An internet connection (required for `googletrans` translation).


## Setup Instructions
Set up instructions are in both the backend and frontend folders.

### Backend Setup (Local)
1. **Clone the Repository**:
2. ```bash
   git clone <your-repo-url>
   cd MiniRegulatoryReportAssistant/backend
Usage Instructions
Input Format
Enter medical reports in the textarea following this structure:

Drug: Mentioned after "taking" and before a period (e.g., "taking Drug X.").
Adverse Events: Listed after "experienced" and before "after" (e.g., "experienced severe nausea and headache after").
Severity: Use "mild", "moderate", or "severe" (case-insensitive).
Outcome: Use "recovered", "ongoing", or "fatal" (case-insensitive) for translation. If not recognized, it defaults to "unknown".

Example:
Patient experienced severe nausea and headache after taking Drug X. Patient recovered.
