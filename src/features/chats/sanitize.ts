import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

/**
 * @description Joi Schema Validation For Chat Feature
 */

 const defaultStringValidate = Joi.string().lowercase().trim();

const ChatSanitize = {
    createMsg: {
        params: {
            recipient: defaultStringValidate.required()
        },
    
        body: {},
    },
};

registerSanitizeSchema(ChatSanitize);

export default ChatSanitize;
