import express, { Request, Response } from 'express';
// eslint-disable-next-line import/no-relative-packages
import { hardcodedWorkouts } from '../../../mobile/src/util/constants';

const router = express.Router();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/', (req: Request, res: Response) => {
  res.send(hardcodedWorkouts);
});

// router.post('/', (req: Request, res: Response) => {
//   // Handle POST requests for workouts
// });

// Add more routes as needed

export default router;
