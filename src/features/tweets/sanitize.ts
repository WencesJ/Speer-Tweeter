import { registerSanitizeSchema } from '@libs/validations/joiSchema';
import Joi from 'joi';

const defaultStringValidate = Joi.string().lowercase().trim();

/**
 * @description Joi Schema Validation For Tweet Feature
 */

const TweetSanitize = {
    createTweet: {
        params: {},
    
        body: {
            text: defaultStringValidate
                .required()
                .min(1)
                .max(200),
    
            date: Joi.date().required(),

            time: {
                hour: Joi.number().min(0).max(23).required(),
                min: Joi.number().min(0).max(59).required(),
                sec: Joi.number().min(0).max(59).required(),
            },
        },
    },
    
    getTweet: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {},
    },
    
    deleteTweet: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {},
    },

    updateTweet: {
        params: {
            _id: defaultStringValidate.required(),
        },
    
        body: {
            text: defaultStringValidate
                .min(1)
                .max(200),
            
            date: Joi.date(),

            time: {
                hour: Joi.number().min(0).max(23),
                min: Joi.number().min(0).max(59),
                sec: Joi.number().min(0).max(59),
            },
        },
    },
    
}

registerSanitizeSchema(TweetSanitize);

export default TweetSanitize;
