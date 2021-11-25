import { Router } from 'express';

//Features
import { Router as userRouter } from '@features/users';

const router = Router();

router.use('/users', userRouter);

export default router;