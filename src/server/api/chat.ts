// src/server/api/users.ts
import express from 'express';
import { conversation } from '../controller/chat.controller.js';

const router = express.Router();

router.post('/', async (req: any, res: any) => {
  const out = await conversation(req, res);
  res.json(out);
});

export default router;
