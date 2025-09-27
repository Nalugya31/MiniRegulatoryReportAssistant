import React from 'react';

function History({ history }) {
  return (
    <div className="History" style={{ maxWidth: "900px", margin: "2rem auto" }}>
      <h1>History</h1>

      {history.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>No.</th>
              <th>Drug</th>
              <th>Events</th>
              <th>Severity</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            {history.map((r, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{r.drug || "—"}</td>
                <td>{r.adverse_events.join(", ") || "-"}</td>
                <td>{r.severity || "-"}</td>
                <td>{r.outcome || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No history available. Process a report to start.</p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <a href="/">Back to Home</a>
      </div>
    </div>
  );
}

export default History;
