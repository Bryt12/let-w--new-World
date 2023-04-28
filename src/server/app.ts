// src/server/app.ts
import express from 'express';
import chatRouter from './api/chat.js';

const app = express();

app.use(express.json());
app.use('/api/chat', chatRouter);

export default app;
