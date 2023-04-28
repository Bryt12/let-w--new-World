// src/server/api/users.ts
import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get Chat' });
});

export default router;
