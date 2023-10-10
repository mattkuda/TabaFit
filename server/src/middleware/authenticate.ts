import {
  Response, NextFunction, Request as ExpressRequest,
} from 'express';
import jwt from 'jsonwebtoken';

interface Request extends ExpressRequest {
    userId?: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  console.log(`THE PARSED TOKEN IS!: ${token}`);
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.userId = decodedToken.id;
    return next(); // Explicitly return the result of next()
  } catch (err) {
    return res.status(401).send({ message: 'Invalid token' });
  }
};

export default authenticate;
