// importing the modules

import { Schema, model, Document, Date } from 'mongoose';

import { removeProps } from '@libs/models/modelUtils';

export interface MsgDocument extends Document {
    text: string;
    author: string;
    recipient: string;
    chat: string;
    date: Date;
    time: {
        hour: number,
        min: number,
        sec: number
    };
    
    findByAuthor: (author: string) => MsgDocument;
    findByRecipient: (recipient: string) => MsgDocument;
    findByChat: (chat: string) => MsgDocument;
}

const msgSchema: Schema<MsgDocument> = new Schema(
    {
        text: {
            type: String,
            required: [true, 'Message must have a Text!'],
            trim: true,
            lowercase: true,
        },

        author: {
            type: Schema.Types.ObjectId,
            required: [true, 'Message must have an author!'],
            ref: 'User'
        },

        recipient: {
            type: Schema.Types.ObjectId,
            required: [true, 'Message must have a recipient!'],
            ref: 'User'
        },

        chat: {
            type: Schema.Types.ObjectId,
            required: [true, 'Message must belong to a chat!'],
            ref: 'Chat'
        },

        date: {
            type: Date,
            required: [true, 'Message must have a date!'],
        },

        time: {
            hour: {
                type: Number,
                min: [0, 'Message hour cannot be less than 0!'],
                max: [23, 'Message hour cannot be greater than 23!'],
                required: [true, 'Message hour of posting is required!']
            },
            min: {
                type: Number,
                min: [0, 'Message minutes cannot be less than 0!'],
                max: [59, 'Message minutes cannot be greater than 59!'],
                required: [true, 'Message minutes of posting is required!']
            },
            sec: {
                type: Number,
                min: [0, 'Message seconds cannot be less than 0!'],
                max: [59, 'Message seconds cannot be greater than 59!'],
                required: [true, 'Message seconds of posting is required!']
            }
        },
    },

    {
        toJSON: { 
            virtuals: true, 
            versionKey: false,
            transform: removeProps([])

        },

        toObject: { virtuals: true, versionKey: false },
        
        timestamps: true,
    }
);

// indexing the doc for quick fetch

msgSchema.index({ chat: 1 });
msgSchema.index({ author: 1 });
msgSchema.index({ recipient: 1 });

// initiating the pre and post hooks

// MSG STATICS
msgSchema.statics.findByAuthor = async function (author: string) {
    return await this.find({ author });
};
msgSchema.statics.findByRecipient = async function (recipient: string) {
    return await this.find({ recipient });
};
msgSchema.statics.findByChat = async function (chat: string) {
    return await this.find({ chat });
};

// MSG METHODS

const Msg = model('Msg', msgSchema);

export default Msg;
