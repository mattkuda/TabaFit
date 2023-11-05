import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export default (id: string): string => jwt.sign(
  { id },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: 7 * 24 * 60 * 60,
    },
);
