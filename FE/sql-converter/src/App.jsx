import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import ExcelToSQL from "./ExcelToSql";

function App() {
  const [sqlQuery, setSqlQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/convert",
        { sqlQuery },
        {
          responseType: "blob",
        }
      );

      // Create a URL for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output.xlsx");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.parentNode.removeChild(link);
    } catch (error) {
      alert("Error converting SQL to Excel");
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <h1>SQL to Excel Converter</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          placeholder="Enter your SQL INSERT query here"
          rows="10"
          cols="50"
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Converting..." : "Convert to Excel"}
        </button>
      </form>
      <div>
        <ExcelToSQL />
      </div>
    </div>
  );
}

export default App;
