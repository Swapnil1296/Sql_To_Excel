const express = require("express");
const router = express.Router();
const XLSX = require("xlsx");
const fs = require("fs");

router.post("/", (req, res) => {
  const { sqlQuery } = req.body;

  try {
    // Extract columns
    const columnsMatch = sqlQuery.match(/\(([^)]+)\)/);
    if (!columnsMatch) {
      return res.status(400).send("Invalid SQL query format");
    }

    const columns = columnsMatch[1]
      .split(",")
      .map((column) => column.trim().replace(/`/g, ""));

    // Extract values
    const valuesMatch = sqlQuery.match(/VALUES\s*\(([^]+)\);/);
    if (!valuesMatch) {
      return res.status(400).send("Invalid SQL query format");
    }

    const valuesString = valuesMatch[1].trim();
    const rows = valuesString.split(/\),\s*\(/).map((row) =>
      row
        .replace(/[\(\)]/g, "")
        .split(",")
        .map((value) =>
          value
            .trim()
            .replace(/^'/, "")
            .replace(/'$/, "")
            .replace(/NULL/g, null)
        )
    );

    // Prepare data for XLSX
    const data = rows.map((row) => {
      let rowData = {};
      columns.forEach((column, index) => {
        rowData[column] = row[index];
      });
      return rowData;
    });

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write to a buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Send the Excel file as a response
    res.setHeader("Content-Disposition", 'attachment; filename="output.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(buffer);
  } catch (error) {
    res.status(500).send("Error processing SQL query");
  }
});

module.exports = router;
