declare let __dirname: string;

import path from 'path';
import express from 'express';

import app from './app.js';

import winston from 'winston';
import expressWinston from 'express-winston';

import dotenv from 'dotenv';

dotenv.config();

// const port = process.env.PORT || 3000;
const port = 3000,
  clientDistFolder = path.resolve(__dirname, '..', 'client'), // This is the most painful line of code I've ever conceived, sorry...
  publicFolder = path.resolve(__dirname, '..', 'client', 'public');
console.log('distFolder', clientDistFolder);
// Winston Logger Config
app.use(
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: 'HTTP {{req.method}} {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute: function (req: any, res: any) {
      return false;
    }, // optional: allows to skip some log messages based on request and/or response
  })
);

// Serve static files from the dist folder
app.use('/dist/client', express.static(clientDistFolder));

// Serve public files from the public folder
app.use('/public', express.static(publicFolder));

// Fallback to index.html for any other request
app.get('*', (req: any, res: any) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'index.html'));
});

// Add a health check route
app.get('/health', (req: any, res: any) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
