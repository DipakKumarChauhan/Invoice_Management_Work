const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');

// Routes
const authRoutes = require("./modules/auth/routes");

// Middleware
const errorHandler = require("./middleware/error_middleware");
const authMiddleware = require("./middleware/auth_middleware");

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use(
    pinoHttp({ 
        logger
    })
);

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use(errorHandler);


app.get('/health', (req,res)=>{
    res.json({ status: 'ok' });
})


//  Test Protected Route

app.get("/api/test/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user
  });
});



module.exports = app;