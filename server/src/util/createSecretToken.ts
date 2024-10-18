import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const createSecretToken = (id: string): string => jwt.sign(
  { id },
  process.env.TOKEN_KEY as string,
  {
    expiresIn: '30m',
  },
);
