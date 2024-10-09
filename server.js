
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
require('./config/db');  // Ensure the DB connection is established
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const gymRoutes = require('./routers/gymRoutes'); // Gym-related routes
const entryRoutes = require('./routers/userEntryRoutes'); // Entry-related routes
const userBMIRoutes = require('./routers/usersBMI'); // UserBMI-related routes

let port = process.env.PORT || 8080;
let app = express();

// Middleware setup
app.use(cors());
app.use(bodyParser.json({ type: 'application/json' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes


// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/", require("./routers/router"));

// Start the server
app.listen(port, (e) => {
    e
        ? console.log('Error connecting to server:', e)
        : console.log(`Server is running on http://localhost:${port}/`);
});
