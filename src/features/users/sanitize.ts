import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();


/**
 * @description Joi Schema Validation For User Feature
 */

const UserSanitize = {
    createUser: {
        params: {},
    
        body: {
            username: defaultStringValidate
                .required()
                .min(3)
                .max(30)
                .label('Username'),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    getUser: {
        params: {
            username: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    deleteUser: {
        params: {
            username: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    loginUser: {
        params: {},
    
        body: {
            username: defaultStringValidate.required(),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
    changePasswordUser: {
        params: {},
    
        body: {
            currentPassword: defaultStringValidate.required().min(6).max(30),
    
            password: defaultStringValidate.required().min(6).max(30),
        },
    },
    
}

registerSanitizeSchema(UserSanitize);

export default UserSanitize;
