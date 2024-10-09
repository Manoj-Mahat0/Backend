const express = require("express");
let bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const ncrypt = require("ncrypt-js");
require("dotenv").config();
require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./docs/swagger");

let port = process.env.PORT || 8080;
let app = express();

app.use(cors());

app.use(bodyParser.json({ type: "application/json" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(require("./middleware/authMiddleware"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", require("./routers/router"));

app.listen(port, (e) => {
  e
    ? console.log("Error connecting to serve :", e)
    : console.log(
        `Server is up on port: ${port} url: http://localhost:${port}/`
      );
});
