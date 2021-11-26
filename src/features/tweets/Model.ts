// importing the modules

import { Schema, model, Document, Date } from 'mongoose';

import { removeProps } from '@libs/models/modelUtils';

export interface TweetDocument extends Document {
    text: string;
    author: string;
    date: Date;
    time: {
        hour: number,
        min: number,
        sec: number
    };
    likes: number,
    threads: boolean
    
    findByAuthor: (author: string) => TweetDocument;

    likeTweet: () => void;
    unlikeTweet: () => void;
}

const tweetSchema: Schema<TweetDocument> = new Schema(
    {
        text: {
            type: String,
            required: [true, 'Tweet must have a Text!'],
            trim: true,
            lowercase: true,
        },

        author: {
            type: Schema.Types.ObjectId,
            required: [true, 'Tweet must have an author!'],
            ref: 'User'
        },

        date: {
            type: Date,
            required: [true, 'Tweet must have a date!'],
        },

        time: {
            hour: {
                type: Number,
                min: [0, 'Tweet hour cannot be less than 0!'],
                max: [23, 'Tweet hour cannot be greater than 23!'],
                required: [true, 'Tweet hour of posting is required!']
            },
            min: {
                type: Number,
                min: [0, 'Tweet minutes cannot be less than 0!'],
                max: [59, 'Tweet minutes cannot be greater than 59!'],
                required: [true, 'Tweet minutes of posting is required!']
            },
            sec: {
                type: Number,
                min: [0, 'Tweet seconds cannot be less than 0!'],
                max: [59, 'Tweet seconds cannot be greater than 59!'],
                required: [true, 'Tweet seconds of posting is required!']
            }
        },

        likes: {
            type: Number,
            default: 0,
            min: [0, 'Tweet likes cannot be less than 0!'],
        },

        threads: {
            type: Boolean,
            default: false
        }
    },

    {
        toJSON: { 
            virtuals: true, 
            versionKey: false,
            //remove fields
            transform: removeProps(['threads'])
        },

        toObject: { virtuals: true, versionKey: false },
        
        timestamps: true,
    }
);

// initiating the pre and post hooks

// TWEET METHODS
tweetSchema.methods.likeTweet = async function () {
    this.likes += 1;

    await this.save({ validateBeforeSave: false });
};
tweetSchema.methods.unlikeTweet = async function () {
    this.likes -= 1;

    await this.save({ validateBeforeSave: false });
};

const Tweet = model('Tweet', tweetSchema);

export default Tweet;
