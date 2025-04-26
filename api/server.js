const express = require("express");

const routes = require("./routes");

const app = express();
const port = 5000;

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;
