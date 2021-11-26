// importing the modules

import { Router } from 'express';

import Controller from './controller';

const {
    getAllUsers,
    signUp,
    logIn,
    logOut,
    changePassword,
    getUser,
} = Controller;

import { reqValidate } from '@libs/validations';
import './sanitize';


const router = Router();

router.get('/', getAllUsers);

router.post('/signup', reqValidate('createUser'), signUp);

router.post('/login', reqValidate('loginUser'), logIn);

router.post('/logout', logOut);

router.get('/:username', reqValidate('getUser'), getUser);

export default router;
