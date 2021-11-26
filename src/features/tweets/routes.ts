// importing the modules

import { Router } from 'express';

import Controller from './controller';

import { Controller as userCntrl } from '@features/users';

import './sanitize';

const {
    getAllTweets,
    getTweet,
    likeTweet,
    unlikeTweet,
    updateTweet,
    deleteTweet,
    createTweet,
} = Controller;

import { reqValidate } from '@libs/validations';

const router = Router();

router.use(userCntrl.authorization);

router

    .route('/')

    .get(getAllTweets)

    .post(reqValidate('createTweet'), createTweet)

router

    .route('/:_id/tweet')

    .get(reqValidate('getTweet'), getTweet)

    .patch(reqValidate('updateTweet'), updateTweet)

    .delete(reqValidate('deleteTweet'), deleteTweet);

router.patch('/:_id/like', likeTweet)

router.patch('/:_id/unlike', unlikeTweet)

export default router;
