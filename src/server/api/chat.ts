// src/server/api/users.ts
import express from 'express';
import { npcChat } from '../controller/chat.controller.js';

const router = express.Router();

router.post('/', async (req: any, res: any) => {
  console.log('Hello!');

  const out = await npcChat(req, res);
  res.json(out);
});

export default router;
