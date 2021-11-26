import { Router } from 'express';

//Features
import { Router as userRouter } from '@features/users';
import { Router as tweetRouter } from '@features/tweets';
import { Router as chatRouter } from '@features/chats';
import { Router as msgRouter } from '@features/msgs';

const router = Router();

router.use('/users', userRouter);
router.use('/tweets', tweetRouter);
router.use('/chats', chatRouter);
router.use('/msgs', msgRouter);

router.use('/', (_, res) => {
    res.send('<h1>Welcome to Speer-Tweeter Api</h1>')
})

export default router;