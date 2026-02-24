const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');

// Routes
const authRoutes = require("./modules/auth/routes");
const invoiceRoutes = require("./modules/invoice/invoice_routes");
const paymentRoutes = require("./modules/payment/payment_routes");
const pdfRoutes = require("./modules/pdf/pdf_routes");

// Middleware
const errorHandler = require("./middleware/error_middleware");
const authMiddleware = require("./middleware/auth_middleware");

const app = express();


// Middleware

app.use(cors({
  origin: true, // Allow all origins for now
  credentials: true
}));

app.use(express.json());

app.use(
    pinoHttp({ 
        logger
    })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/pdf", pdfRoutes);

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