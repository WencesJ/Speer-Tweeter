// importing the modules

import { Router } from 'express';

import Controller from './controller';

import { Controller as userCntrl } from '@features/users';

import './sanitize';

const {
    deleteMsg,
    createMsg,
    getMsgsByChat,
} = Controller;

import { reqValidate } from '@libs/validations';

// const msgCntrl = new MsgController();

const router = Router();

router.use(userCntrl.authorization);

router.get('/:chat/chat', reqValidate('getMsgsByChat'), getMsgsByChat)

router

    .route('/:chat/msg')

    .post(reqValidate('createMsg'), createMsg)

    .delete(reqValidate('deleteMsg'), deleteMsg);

export default router;
