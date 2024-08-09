import React, { useState } from "react";
import axios from "axios";

function ExcelToSQL() {
  const [file, setFile] = useState(null);
  const [sqlQuery, setSqlQuery] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/convert-to-sql/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSqlQuery(response.data.sqlQuery);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <h1>Upload Excel File to Convert to SQL</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload and Convert</button>
      <pre>{sqlQuery}</pre>
    </div>
  );
}

export default ExcelToSQL;
