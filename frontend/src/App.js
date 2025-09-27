import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import History from './History';

function App() {
  const [report, setReport] = useState('');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [translatedOutcome, setTranslatedOutcome] = useState('');
  const [lang, setLang] = useState('fr');
  const chartRef = useRef(null);

  const processReport = async () => {
    const response = await fetch('https://mini-regulatory-backend.onrender.com//process-report', { // Replace with your Render URL
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ report }),
    });
    const data = await response.json();
    if (data.outcome === "unknown") {
      alert("Warning: Outcome not recognized. Use 'recovered', 'ongoing', or 'fatal'.");
    }
    setResult(data);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const response = await fetch('https://mini-regulatory-backend.onrender.com//reports'); // Replace with your Render URL
    const data = await response.json();
    setHistory(data);
    updateChart(data);
  };

  const translateOutcome = async () => {
    if (!result) return;
    console.log("Translating outcome:", result.outcome, "to", lang);
    try {
      const response = await fetch(`https://mini-regulatory-backend.onrender.com//translate?outcome=${encodeURIComponent(result.outcome)}&lang=${lang}`); // Replace with your Render URL
      const data = await response.json();
      if (response.ok) {
        setTranslatedOutcome(data.translation);
        console.log("Translation result:", data.translation);
      } else {
        console.error("Translation error:", data);
        alert(data.detail || "Translation failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Error during translation: " + error.message);
    }
  };

  const updateChart = (reports) => {
    const severityCounts = { mild: 0, moderate: 0, severe: 0, unknown: 0 };
    reports.forEach(r => severityCounts[r.severity]++);
    
    const ctx = document.getElementById('severityChart');
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
    const newChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(severityCounts),
        datasets: [{ data: Object.values(severityCounts), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#ccc'] }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1,
        layout: { padding: 10 }
      },
    });
    chartRef.current = newChart;
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Home</Link> | <Link to="/history">History</Link>
        </nav>
        <Routes>
          <Route exact path="/" element={
            <>
              <h1>Mini Regulatory Report Assistant</h1>
              <textarea
                placeholder="Example: 'Patient experienced severe nausea and headache after taking Drug X. Patient recovered.Use 'mild/moderate/severe' for severity and 'recovered/ongoing/fatal' for outcome."
                value={report}
                onChange={(e) => setReport(e.target.value)}
              />
              <button onClick={processReport} style={{ marginLeft: "20px" }}>Process Report</button>
              
              {result && (
                <div>
                  <h2>Results</h2>
                  <table>
                    <tbody>
                      <tr><td>Drug</td><td>{result.drug}</td></tr>
                      <tr><td>Adverse Events</td><td>{result.adverse_events.join(', ')}</td></tr>
                      <tr><td>Severity</td><td>{result.severity}</td></tr>
                      <tr><td>Outcome</td><td>{result.outcome}</td></tr>
                    </tbody>
                  </table>
                  <select value={lang} onChange={(e) => setLang(e.target.value)}>
                    <option value="fr">French</option>
                    <option value="sw">Swahili</option>
                  </select>
                  <button onClick={translateOutcome}>Translate Outcome</button>
                  {translatedOutcome && <p>Translated: {translatedOutcome}</p>}
                </div>
              )}
              
              <h2>Severity Distribution</h2>
              <div className="chart-container">
                <canvas id="severityChart"></canvas>
              </div>
            </>
          } />
          <Route path="/history" element={<History history={history} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;