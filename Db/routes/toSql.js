const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const router = express.Router();

// Set up multer for file uploads
const upload = multer({ dest: "uploads/" });

// API endpoint to handle file upload and conversion
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Read the Excel file
  const workbook = XLSX.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  // Generate SQL queries
  const tableName = "your_table_name"; // Adjust as needed
  const columns = Object.keys(data[0])
    .map((col) => `\`${col}\``)
    .join(", ");
  const values = data
    .map((row) => {
      const rowValues = Object.values(row)
        .map((value) => {
          if (value === null || value === undefined) return "NULL";
          if (typeof value === "string")
            return `'${value.replace(/'/g, "''")}'`;
          return value;
        })
        .join(", ");
      return `(${rowValues})`;
    })
    .join(",\n");

  const sqlQuery = `INSERT INTO ${tableName} (${columns}) VALUES ${values};`;

  res.send({ sqlQuery });

  // Optionally, clean up uploaded file
  // fs.unlinkSync(req.file.path);
});

module.exports = router;
