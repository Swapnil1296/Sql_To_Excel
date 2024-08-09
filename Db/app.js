const express = require("express");
const cors = require("cors");
const convertRoute = require("./routes/convert");
const convertToSQlRoute = require("./routes/toSql");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Route for SQL to Excel conversion
app.use("/api/convert", convertRoute);
app.use("/api/convert-to-sql", convertToSQlRoute);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
