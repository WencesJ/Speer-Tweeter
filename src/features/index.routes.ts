import { Router } from 'express';

//Features
import { Router as userRouter } from '@features/users';
import { Router as tweetRouter } from '@features/tweets';

const router = Router();

router.use('/users', userRouter);
router.use('/tweets', tweetRouter);

export default router;