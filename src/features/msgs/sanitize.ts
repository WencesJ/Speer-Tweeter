import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();

/**
 * @description Joi Schema Validation For Msg Feature
 */

const MsgSanitize = {
    createMsg: {
        params: {
            chat: defaultStringValidate.required(),
        },
    
        body: {
            text: defaultStringValidate
                .required()
                .min(1)
                .max(200),
                
            date: Joi.date().required(),
            
            recipient: defaultStringValidate.required(),

            time: {
                hour: Joi.number().min(0).max(23).required(),
                min: Joi.number().min(0).max(59).required(),
                sec: Joi.number().min(0).max(59).required(),
            },
        },
    },
    
    getMsgsByChat: {
        params: {
            chat: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    deleteMsg: {
        params: {
            chat: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
}

registerSanitizeSchema(MsgSanitize);

export default MsgSanitize;
