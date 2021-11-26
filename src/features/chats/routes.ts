// importing the modules

import { Router } from 'express';

import Controller from './controller';

import { Controller as userCntrl } from '@features/users';

import './sanitize';

const {
    getAllChats,
    deleteChat,
    getChatByRecipient
} = Controller;

const router = Router();

router.use(userCntrl.authorization);

router.get('/', getAllChats);
router.get('/:recipient/recipient', getChatByRecipient);
router.delete('/:_id/chat', deleteChat);

export default router;
