const express = require('express');
const cors = require('cors');
const pinoHttp = require('pino-http');
const logger = require('./utils/logger');

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

app.use(
    pinoHttp({ 
        logger
    })
);

app.get('/health', (req,res)=>{
    res.json({ status: 'ok' });
})



module.exports = app;